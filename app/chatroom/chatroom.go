package chatroom

import (
	"chant/app/factory"
	"chant/app/models"
	"container/list"
	"html"
	"time"
	// "github.com/revel/revel"

	"github.com/otiai10/rodeo"
)

const archiveSize = 4
const soundArchiveSize = 21
const stampArchiveSize = 25

var (
	// Send a channel here to get room events back.  It will send the entire
	// archive initially, and then new messages as they come in.
	newcommer = make(chan (chan<- Subscription), 1000)
	// ここにチャンネルを送ると、
	unsubscribe = make(chan (<-chan Event), 1000)
	// Send events here to publish them.
	publish = make(chan Event, 1000)

	keepalive = time.Tick(50 * time.Second)

	info = &Info{
		make(map[string]*models.User),
		true,
		list.New(),
	}

	// SoundTrack ...
	SoundTrack = list.New()
	// StampArchive ...
	StampArchive = []models.Stamp{}

	vaquero    *rodeo.Vaquero
	persistent = false
	room       *Room
)

// GetRoom オンリーワンなChatroomを返す
func GetRoom() *Room {
	if room == nil {
		room = new(Room)
	}
	return room
}

// Room まだ使ってないけど、"chatroom"っていう単位はプロセス1-1じゃないはず
type Room struct {
	ID string // 適当なUUID
	// インメモリアーカイブ
	Archives struct {
		Stamps   []models.Stamp // インメモリで覚えているスタンプ
		Sounds   []models.Sound // インメモリで覚えているサウンド
		Messages []Event        // インメモリで覚えている発言イベント
	}
	// 参加者
	Members map[string]struct { // 参加者
		User         models.User  // 本来は、SubscriptionをUserに埋めたい
		Subscription Subscription // とりあえずここにSubscription
	}
	// めた情報
	Info interface{} // TODO
	// いろいろあったときのチャンネル
	Channels struct {
		Entrance  chan (<-chan Subscription) // 部屋に新しいひとが入ってきたときの
		Exit      chan (<-chan Event)        // 部屋から誰かが出て行ったときの
		Publish   chan Event                 // イベントがあったときの
		Heartbeat *time.Ticker               // 一定時間ごとに、こちらからkeepaliveを送りたい
	}
}

// Archive RoomにArchiveしとくやつ
func (r *Room) Archive(event Event) {
	if event.Type == "message" {
		r.Archives.Messages = append(r.Archives.Messages, event)
		if len(r.Archives.Messages) > 5 {
			r.Archives.Messages = r.Archives.Messages[:5]
		}
	}
}

// Forever Room 1個につき1回しか呼ばれない
// Roomのライフサイクルと一致している
// 当面は、1process - 1roomインスタンスで運用する
func (r *Room) Forever() {

}

// Event ...
type Event struct {
	// TODO: "stamp", "sound" とかもTypeで処理したい
	Type      string       // "join", "leave", or "message" だけじゃなくてもいいよね
	User      *models.User // イベント発行ユーザ。ユーザに紐づかないものはnil
	Timestamp int          // タイムスタンプ
	Text      string       // valueに相当するもの
	RoomInfo  *Info        // 現在のRoomの状態を常に送信？ これいる？
	Initial   bool         // アーカイブイベントを初期接続で送るイベントかどうか
}

// Subscription 新しいイベントを伝えるためのチャンネルラッパー
type Subscription struct {
	New <-chan Event // 新しいイベントをこのsubscriberに伝えるチャンネル
}

// Info ...
type Info struct {
	Users    map[string]*models.User
	Updated  bool
	AllUsers *list.List
}

// Cancel Owner of a subscription must cancel it when they stop listening to events.
// Cancel
func (s Subscription) Cancel() {
	unsubscribe <- s.New // Unsubscribe the channel.
	drain(s.New)         // Drain it, just in case there was a pending publish.
}

// NewEvent ...
func NewEvent(typ string, user *models.User, msg string) Event {
	return Event{
		Type:      typ,
		User:      user,
		Timestamp: int(time.Now().Unix()),
		Text:      msg,
		RoomInfo:  info,
	}
}

// NewKeepAlive ...
func NewKeepAlive() Event {
	return Event{
		"keepalive",
		&models.User{},
		int(time.Now().Unix()),
		"",
		info,
		false,
	}
}

// Subscribe ...
func Subscribe() Subscription {
	resp := make(chan Subscription)
	newcommer <- resp
	return <-resp
}

// Join ...
func Join(user *models.User) {
	publish <- NewEvent("join", user, "")
}

// Say ...
func Say(user *models.User, message string) {
	message = html.EscapeString(message)
	publish <- NewEvent("message", user, message)
}

// Leave ...
func Leave(user *models.User) {
	publish <- NewEvent("leave", user, "")
}

// ここは、Room.Forever()に置き換えるよてい
func chatroom() {
	subscribers := list.New()

	for {
		select {
		case ch := <-newcommer:
			subscriber := make(chan Event, 10)
			subscribers.PushBack(subscriber)
			ch <- Subscription{subscriber}

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
					if stamp.IsUsedEvent {
						event.Type = "message"
						event.Text = stamp.Value
					}
					addStamp(stamp)
				}
			}
			GetRoom().Archive(event)

			// Finally, subscribe
			for ch := subscribers.Front(); ch != nil; ch = ch.Next() {
				if sub, ok := ch.Value.(chan Event); ok {
					go func(sub chan Event, event Event) {
						sub <- event
					}(sub, event)
				}
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

func leaveUser(user *models.User) {
	for u := info.AllUsers.Front(); u != nil; u = u.Next() {
		if u.Value.(*models.User).ScreenName == user.ScreenName {
			// delete only one
			_ = info.AllUsers.Remove(u)
			return
		}
	}
}
func restoreRoomUsers() {
	// TODO: DRY
	info.Users = make(map[string]*models.User)
	for u := info.AllUsers.Front(); u != nil; u = u.Next() {
		user := u.Value.(*models.User)
		info.Users[user.ScreenName] = user
	}
}
func init() {
	RestoreStamps()
	go chatroom()
}

// Helpers

// イベントを受けるチャンネルを、イベントが流れ込んだときに詰まらないように、あとしまつする
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
		return
	}
	persistent = true
	vaquero.Cast("chant.stamps", &StampArchive)
}

// SaveStamps saves stamps
func SaveStamps() {
	vaquero.Store("chant.stamps", StampArchive)
	return
}

// addStamp adds stamp to archive, sort them by LRU and delete overflow
func addStamp(stamp models.Stamp) {
	// filter first
	pool := []models.Stamp{}
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
	if persistent {
		SaveStamps()
	}
}

// GetStampArchive returns stamp archives sorted by LRU
func GetStampArchive() []models.Stamp {
	return StampArchive
}

// GetMessageArchive インメモリEventアーカイブを返す
func GetMessageArchive() []Event {
	return GetRoom().Archives.Messages
}
