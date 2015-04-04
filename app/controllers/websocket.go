package controllers

import (
	"chant/app/chatroom"
	"chant/app/models"

	"code.google.com/p/go.net/websocket"
	"github.com/revel/revel"
)

// ChantSocket is controller to keep socket connection.
type ChantSocket struct {
	*revel.Controller
}

// RoomSocket handles `GET /websocket/room/socket` and `websocket connection`
func (c ChantSocket) RoomSocket(ws *websocket.Conn) revel.Result {

	// Twitterログインしてないひとはハンドシェイクしようとしてもダメです
	_, ok := c.Session["screenName"]
	if !ok {
		c.Redirect(Application.Index)
	}

	// ハンドシェイクが成立したひとの情報をセッションから復元する
	user := &models.User{
		Name:            c.Session["Name"],
		ScreenName:      c.Session["screenName"],
		ProfileImageURL: c.Session["profileImageUrl"],
	}

	// chatroomと接続
	subscription := chatroom.Subscribe()
	defer subscription.Cancel() // subscriptionをやめる

	// chatroomに参加した事を告知
	chatroom.Join(user)
	defer chatroom.Leave(user)

	// chatroomに残ってるアーカイブイベントを吸収
	for _, event := range chatroom.GetMessageArchive() {
		event.Initial = true
		if websocket.JSON.Send(ws, &event) != nil {
			return nil // 受け取れなければソケット終了
		}
	}

	// chatroomに残ってるSoundを吸収
	// TODO: これ、なんでcontainer/listである必要があるの？
	// TODO: chatroom.StampArchive []Sound
	for sound := chatroom.SoundTrack.Front(); sound != nil; sound = sound.Next() {
		s := (sound.Value).(models.Sound)
		s.Initial = true
		if websocket.JSON.Send(ws, s) != nil {
			return nil // 受け取れなければソケット終了
		}
	}

	// chatroomに残ってるStampを吸収
	for _, stamp := range chatroom.GetStampArchive() {
		stamp.Initial = true
		if websocket.JSON.Send(ws, stamp) != nil {
			return nil // 受け取れなければソケット終了
		}
	}

	// 自分自身のソケットから来る発言を受け取るチャンネル
	myself := make(chan string)
	// 自分自身のソケットから来る発言を流すgoroutineを流す
	go listenMyself(ws, myself)

	// リッスン！
	for {
		select {
		case event := <-subscription.New:
			// chatroomへのsubscriptionから新しいイベントが出てきたら
			// それを自分のwebsocketに流し込む
			if websocket.JSON.Send(ws, &event) != nil {
				// They disconnected.
				return nil
			}
		case msg, ok := <-myself:
			if !ok {
				return nil // myselfがcloseしてればソケット終了
			}
			// chatroomに発言する
			chatroom.Say(user, msg)
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
