package controllers

import (
	"chant.v1/app/chatroom"
	"chant.v1/app/models"

	"fmt"

	"github.com/revel/revel"
	"golang.org/x/net/websocket"
	"time"
)

// ChantSocket is controller to keep socket connection.
type ChantSocket struct {
	*revel.Controller
}

// RoomSocket handles `GET /websocket/room/socket` and `websocket connection`
func (c ChantSocket) RoomSocket(ws *websocket.Conn) revel.Result {

	// Twitterログインしてないひとはハンドシェイクしようとしてもダメです
	_, ok := c.Session["screen_name"]
	if !ok {
		return c.Redirect(Application.Index)
	}

	// ハンドシェイクが成立したひとの情報をセッションから復元する
	user, err := models.RestoreUserFromJSON(c.Session["user_raw"])
	if err != nil {
		revel.ERROR.Println(err)
		return c.Redirect(Application.Index)
	}

	myroom := chatroom.GetRoom()

	subscription := myroom.Subscribe()
	defer myroom.Unsubscribe(subscription)

	// chatroomと接続
	// subscription := chatroom.Subscribe()
	// defer subscription.Cancel() // subscriptionをやめる

	// chatroomに参加した事を告知
	/*
		chatroom.Join(user)
		defer chatroom.Leave(user)
	*/

	// chatroomに残ってるアーカイブイベントを吸収
	/*
		for _, event := range chatroom.GetMessageArchive() {
			event.Initial = true
			if websocket.JSON.Send(ws, &event) != nil {
				return nil // 受け取れなければソケット終了
			}
		}
	*/

	// chatroomに残ってるSoundを吸収
	// TODO: これ、なんでcontainer/listである必要があるの？
	// TODO: chatroom.StampArchive []Sound
	/*
		for sound := chatroom.SoundTrack.Front(); sound != nil; sound = sound.Next() {
			s := (sound.Value).(models.Sound)
			s.Initial = true
			if websocket.JSON.Send(ws, s) != nil {
				return nil // 受け取れなければソケット終了
			}
		}
	*/

	// chatroomに残ってるStampを吸収
	/*
		for _, stamp := range chatroom.GetStampArchive() {
			stamp.Initial = true
			if websocket.JSON.Send(ws, stamp) != nil {
				return nil // 受け取れなければソケット終了
			}
		}
	*/

	// 自分自身のソケットから来る発言を受け取るチャンネル
	myself := make(chan string)
	// 自分自身のソケットから来る発言を流すgoroutineを流す
	go listenMyself(ws, myself)

	tick := time.Tick(3 * time.Second)
	go func() {
		for {
			now := <-tick
			websocket.JSON.Send(ws, map[string]interface{}{
				"test": "やったー通ったー" + now.String(),
			})
		}
	}()

	// リッスン！
	for {
		select {
		case event := <-subscription.New:
			// chatroomへのsubscriptionから新しいイベントが出てきたら
			// それを自分のwebsocketに流し込む
			if websocket.JSON.Send(ws, &event) != nil {
				revel.INFO.Println("websocket.JSON.Sendに失敗したら、このループを終了してdeferを呼ぶ")
				return nil
			}
		case msg, ok := <-myself:
			revel.INFO.Println("myselfチャンネルがcloseしていれば、このループを終了してdeferを呼ぶ")
			if !ok {
				return nil // myselfがcloseしてればソケット終了
			}
			myroom.Say(user, msg)
			fmt.Println(msg, ok, " <-myself")
		}
	}
}

// 自分の発言をコネクションから受け取った発言をチャンネルに流す
func listenMyself(conn *websocket.Conn, reciever chan<- string) {
	var msg string
	for {
		if err := websocket.Message.Receive(conn, &msg); err != nil {
			close(reciever)
			return
		}
		reciever <- msg
	}
}
