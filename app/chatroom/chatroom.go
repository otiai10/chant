package chatroom

import (
	"chant/app/factory"
	"chant/app/models"
	"container/list"
	"log"
	"time"
	// "github.com/revel/revel"

	"github.com/otiai10/rodeo"
)

type Event struct {
	Type      string // "join", "leave", or "message"
	User      *model.User
	Timestamp int    // Unix timestamp (secs)
	Text      string // What the user said (if Type == "message")
	RoomInfo  *Info
}

type Subscription struct {
	Archive []Event      // All the events from the archive.
	New     <-chan Event // New events coming in.
}

type Info struct {
	Users    map[string]*model.User
	Updated  bool
	AllUsers *list.List
}

// Owner of a subscription must cancel it when they stop listening to events.
func (s Subscription) Cancel() {
	unsubscribe <- s.New // Unsubscribe the channel.
	drain(s.New)         // Drain it, just in case there was a pending publish.
}

func NewEvent(typ string, user *model.User, msg string) Event {
	return Event{
		typ,
		user,
		int(time.Now().Unix()),
		msg,
		info,
	}
}
func NewKeepAlive() Event {
	return Event{
		"keepalive",
		&model.User{},
		int(time.Now().Unix()),
		"",
		info,
	}
}

func Subscribe() Subscription {
	resp := make(chan Subscription)
	subscribe <- resp
	return <-resp
}

func Join(user *model.User) {
	publish <- NewEvent("join", user, "")
}

func Say(user *model.User, message string) {
	publish <- NewEvent("message", user, message)
}

func Leave(user *model.User) {
	publish <- NewEvent("leave", user, "")
}

const archiveSize = 4
const soundArchiveSize = 21
const stampArchiveSize = 20

var (
	// Send a channel here to get room events back.  It will send the entire
	// archive initially, and then new messages as they come in.
	subscribe = make(chan (chan<- Subscription), 1000)
	// Send a channel here to unsubscribe.
	unsubscribe = make(chan (<-chan Event), 1000)
	// Send events here to publish them.
	publish = make(chan Event, 1000)

	keepalive = time.Tick(50 * time.Second)

	info = &Info{
		make(map[string]*model.User),
		true,
		list.New(),
	}

	SoundTrack   = list.New()
	StampArchive = []model.Stamp{}

	vaquero *rodeo.Vaquero
)

// This function loops forever, handling the chat room pubsub
func chatroom() {
	archive := list.New()
	subscribers := list.New()

	for {
		select {
		case ch := <-subscribe:
			var events []Event
			for e := archive.Front(); e != nil; e = e.Next() {
				events = append(events, e.Value.(Event))
			}
			subscriber := make(chan Event, 10)
			subscribers.PushBack(subscriber)
			ch <- Subscription{events, subscriber}

		case event := <-publish:
			// {{{ クソ
			event.RoomInfo.Updated = false
			if event.Type == "join" {
				info.AllUsers.PushBack(event.User)
				event.RoomInfo.Updated = true
			}
			if event.Type == "leave" {
				// delete(info.Users, event.User.ScreenName)
				leaveUser(event.User)
				event.RoomInfo.Updated = true
			}
			restoreRoomUsers()
			event.RoomInfo = info
			// }}}
			if event.Type == "message" {
				sound, soundError := factory.SoundFromText(event.Text, event.User)
				if soundError == nil {
					//fmt.Printf("このサウンドをアーカイブ:\t%+v\n", sound)
					if SoundTrack.Len() >= soundArchiveSize {
						SoundTrack.Remove(SoundTrack.Front())
					}
					SoundTrack.PushBack(sound)
				} else {
					// revel.ERROR.Println("たぶんここ？", soundError)
				}
				if stamp, err := factory.StampFromText(event.Text); err == nil {
					addStamp(stamp)
				}
			}
			if archive.Len() >= archiveSize {
				archive.Remove(archive.Front())
			}
			if event.Type != "leave" && event.Type != "join" {
				archive.PushBack(event)
			}

			// Finally, subscribe
			for ch := subscribers.Front(); ch != nil; ch = ch.Next() {
				ch.Value.(chan Event) <- event
			}
		case <-keepalive:
			for subscriber := subscribers.Front(); subscriber != nil; subscriber = subscriber.Next() {
				subscriber.Value.(chan Event) <- NewKeepAlive()
			}

		case unsub := <-unsubscribe:
			for ch := subscribers.Front(); ch != nil; ch = ch.Next() {
				if ch.Value.(chan Event) == unsub {
					subscribers.Remove(ch)
					break
				}
			}
		}
	}
}

func leaveUser(user *model.User) {
	for u := info.AllUsers.Front(); u != nil; u = u.Next() {
		if u.Value.(*model.User).ScreenName == user.ScreenName {
			// delete only one
			_ = info.AllUsers.Remove(u)
			return
		}
	}
}
func restoreRoomUsers() {
	// TODO: DRY
	info.Users = make(map[string]*model.User)
	for u := info.AllUsers.Front(); u != nil; u = u.Next() {
		user := u.Value.(*model.User)
		info.Users[user.ScreenName] = user
	}
}
func init() {
	RestoreStamps()
	go chatroom()
}

// Helpers

// Drains a given channel of any messages.
func drain(ch <-chan Event) {
	for {
		select {
		case _, ok := <-ch:
			if !ok {
				return
			}
		default:
			return
		}
	}
}

// RestoreStamps restores stamp archive from Database.
func RestoreStamps() {
	var err error
	if vaquero, err = rodeo.NewVaquero("localhost", "6379"); err != nil {
		log.Fatalln(err)
	}
	vaquero.Cast("chant.stamps", &StampArchive)
}

// SaveStamps saves stamps
func SaveStamps() {
	vaquero.Store("chant.stamps", StampArchive)
	return
}

// addStamp adds stamp to archive, sort them by LRU and delete overflow
func addStamp(stamp model.Stamp) {
	// filter first
	pool := []model.Stamp{}
	for _, s := range StampArchive {
		if s.Value != stamp.Value {
			pool = append(pool, s)
		}
	}
	// append new
	StampArchive = append(pool, stamp)
	// cut head
	if len(StampArchive) > stampArchiveSize {
		StampArchive = StampArchive[len(StampArchive)-stampArchiveSize:]
	}
	// FIXME: ここで毎回呼ぶのはクソ
	SaveStamps()
}

// GetStampArchive returns stamp archives sorted by LRU
func GetStampArchive() []model.Stamp {
	return StampArchive
}
