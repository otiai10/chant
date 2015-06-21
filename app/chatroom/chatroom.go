package chatroom

import (
	// "chant/app/factory"
	"container/list"
	// "encoding/json"
	// "html"
	// "time"

	"chant.v1/app/models"
	// "github.com/revel/revel"

	"log"

	// "github.com/otiai10/rodeo"
)

var rooms = map[string]*Room{
	"default": nil,
}

type Room struct {
	entrance    chan Subscription
	exit        chan Subscription
	publish     chan *models.Event
	terminate   chan interface{}
	subscribers *list.List
	Info        interface{}
}

// Open Roomごとに部屋を開く. foreverなgoroutineをつくる.
func (room *Room) Serve() {
	for {
		select {
		// Roomは、
		// エントランスからsubscription依頼が来たら
		// subscriptionをRoomのsubscribersに登録しつつ
		// 受信用のチャンネルを返してあげる必要がある.
		case sub := <-room.entrance:
			room.subscribers.PushBack(sub)
			log.Println("room.entrance", sub)
			// Roomは、
		// 出口にsubscriptionを投げられたら
		// subscriptionをRoomのsubscribersから抹消する必要がある.

		case sub := <-room.exit:
			for one := room.subscribers.Front(); one != nil; one = one.Next() {
				if the, ok := one.Value.(Subscription); ok && the == sub {
					room.subscribers.Remove(one)
				}
			}
			room.drain(sub)
		// Roomは、
		// publish用のチャンネルに新しいイベントを流し込まれたとき、
		// そのイベントを登録されている全Subscribersに配信する必要がある.
		case ev := <-room.publish:
			log.Println("room.publish", ev)
		// Roomは、
		// なんらかの不具合があったときに
		// foreverなルーチンを終了して死ぬ.
		case cause := <-room.terminate:
			log.Println(cause)
			return
		}
	}
}

func newRoom() *Room {
	room := &Room{
		entrance:    make(chan Subscription),
		exit:        make(chan Subscription),
		publish:     make(chan *models.Event),
		subscribers: list.New(),
	}
	go room.Serve()
	return room
}

func GetRoom(id ...string) *Room {
	id = append(id, "default") // id指定がなければdefaultを使う
	room, ok := rooms[id[0]]
	if !ok || room == nil {
		room = newRoom()
		rooms[id[0]] = room
	}
	return room
}

// Subscribe は呼ばれると、このroomのsubscribersに登録されたsubscriptionが提供される。
func (room *Room) Subscribe() Subscription {
	subscription := Subscription{New: make(chan models.Event)}
	room.entrance <- subscription
	return subscription
}

// Unsubscribe は呼ばれると、このroomのsubscribersから抜ける（べき）。
func (room *Room) Unsubscribe(subscription Subscription) {
	room.exit <- subscription
	room.drain(subscription)
}

// 不要になったsubscriptionからの流し込みを受けるだけのメソッド。
func (room *Room) drain(subscription Subscription) {
	for {
		select {
		case _, ok := <-subscription.New:
			if !ok {
				return
			}
		default:
			return
		}
	}
}

// Subscription 新しいイベントを伝えるためのチャンネルラッパー
type Subscription struct {
	New <-chan models.Event // 新しいイベントをこのsubscriberに伝えるチャンネル
}

// NewEvent タイプによってfactoryを呼びたい。
func NewEvent(typ int, raw string, user *models.User) *models.Event {
	event := &models.Event{
		Type: models.EventType(typ),
		User: user,
		Raw:  raw,
	}
	// models.NewEvent(typ, raw string, user *models.User)
	return event
}

/*
// Join ...
func Join(user *models.User) {
	publish <- NewEvent("join", user, "")
}
*/

func (room *Room) Say(user *models.User, msg string) {
	log.Println(msg)
}

/*
// Say ...
func Say(user *models.User, message string) {
	ev := models.Event{}
	if err := json.Unmarshal([]byte(message), &ev); err != nil {
		publish <- ev
		return
	}
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
		// new commerのsubscriptionがきたら、それをRoomに追加のうえ、
		// subscriptionそのものを返す
		case ch := <-newcommer:
			subscriber := make(chan models.Event, 10)
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

			// archive event
			room.Get().Archives.Messages.Add(event)

			// Finally, subscribe
			for ch := subscribers.Front(); ch != nil; ch = ch.Next() {
				if sub, ok := ch.Value.(chan models.Event); ok {
					go func(sub chan models.Event, event models.Event) {
						sub <- event
					}(sub, event)
				}
			}
		case <-keepalive:
			for subscriber := subscribers.Front(); subscriber != nil; subscriber = subscriber.Next() {
				subscriber.Value.(chan models.Event) <- NewKeepAlive()
			}

		case unsub := <-unsubscribe:
			for ch := subscribers.Front(); ch != nil; ch = ch.Next() {
				if ch.Value.(chan models.Event) == unsub {
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
func drain(ch <-chan models.Event) {
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
func GetMessageArchive() []models.Event {
	return room.Get().Archives.Messages.Get()
}
*/
