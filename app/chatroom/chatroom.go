package chatroom

import (
	// "chant/app/factory"
	"container/list"
	// "encoding/json"
	// "html"
	// "time"

	"chant.v1/app/models"
	"chant.v1/app/repository"
	// "github.com/revel/revel"

	"log"

	// "github.com/otiai10/rodeo"
	"fmt"
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
	members     *list.List
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
			for one := room.subscribers.Front(); one != nil; one = one.Next() {
				if the, ok := one.Value.(Subscription); ok {
					the.New <- ev
				}
			}
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
		members:     list.New(),
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
	subscription := Subscription{New: make(chan *models.Event)}
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
	New chan *models.Event // 新しいイベントをこのsubscriberに伝えるチャンネル
}

func (room *Room) Say(user *models.User, msg string) {
	event, err := models.ConstructEvent(user, msg)
	if err != nil {
		fmt.Println("construct event error", err)
		// TODO: なんかする
		return
	}
	repository.PushMessage(event)
	room.publish <- event
}

func (room *Room) Join(user *models.User) {
	room.members.PushBack(user)
	event := new(models.Event)
	event.User = user
	event.Type = models.JOIN
	event.Value = room.getUniqueUsers()
	room.publish <- event
}

func (room *Room) Leave(user *models.User) {
	room.removeOneUser(user)
	event := new(models.Event)
	event.User = user
	event.Type = models.LEAVE
	event.Value = room.getUniqueUsers()
	room.publish <- event
}

func (room *Room) getUniqueUsers() map[string]*models.User {
	res := map[string]*models.User{}
	for e := room.members.Front(); e != nil; e = e.Next() {
		user := e.Value.(*models.User)
		res[user.IDstr] = user
	}
	return res
}

func (room *Room) removeOneUser(user *models.User) {
	for e := room.members.Front(); e != nil; e = e.Next() {
		if the := e.Value.(*models.User); the.IDstr == user.IDstr {
			room.members.Remove(e)
			return
		}
	}
}
