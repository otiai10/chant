package chatroom

import (
	"chant/app/factory"
	"chant/app/models"
	"container/list"
	"time"
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
	Users   map[string]*model.User
	Updated bool
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
const stampArchiveSize = 21

var (
	// Send a channel here to get room events back.  It will send the entire
	// archive initially, and then new messages as they come in.
	subscribe = make(chan (chan<- Subscription), 10)
	// Send a channel here to unsubscribe.
	unsubscribe = make(chan (<-chan Event), 10)
	// Send events here to publish them.
	publish = make(chan Event, 10)

	info = &Info{
		make(map[string]*model.User),
		true,
	}

	SoundTrack   = list.New()
	StampArchive = list.New()
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
				if _, already := info.Users[event.User.ScreenName]; !already {
					info.Users[event.User.ScreenName] = event.User
				}
				event.RoomInfo = info
				event.RoomInfo.Updated = true
			}
			if event.Type == "leave" {
				delete(info.Users, event.User.ScreenName)
				event.RoomInfo = info
				event.RoomInfo.Updated = true
			}
			// }}}
			for ch := subscribers.Front(); ch != nil; ch = ch.Next() {
				ch.Value.(chan Event) <- event
			}
			if event.Type == "message" {
				sound, soundError := factory.SoundFromText(event.Text, event.User)
				if soundError == nil {
					//fmt.Printf("このサウンドをアーカイブ:\t%+v\n", sound)
					if SoundTrack.Len() >= soundArchiveSize {
						SoundTrack.Remove(SoundTrack.Front())
					}
					SoundTrack.PushBack(sound)
				}
				stamp, stampError := factory.StampFromText(event.Text)
				if stampError == nil {
					// fmt.Printf("このスタンプをアーカイブ:\t%+v\n", stamp)
					if StampArchive.Len() >= stampArchiveSize {
						StampArchive.Remove(StampArchive.Front())
					}
					StampArchive.PushBack(stamp)
				}
			}
			if archive.Len() >= archiveSize {
				archive.Remove(archive.Front())
			}
			if event.Type != "leave" && event.Type != "join" {
				archive.PushBack(event)
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

func init() {
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
