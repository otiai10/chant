package controllers

import (
	"chant.v1/app/chatroom"
	"chant.v1/app/models"

	"github.com/revel/revel"
	"golang.org/x/net/websocket"
)

// ChantSocket is controller to keep socket connection.
type ChantSocket struct {
	*revel.Controller
}

// RoomSocket handles `GET /websocket/room/socket` and `websocket connection`
func (c ChantSocket) RoomSocket(ws *websocket.Conn) revel.Result {

	user, err := models.RestoreUserFromJSON(c.Session["user_raw"])
	if err != nil {
		revel.ERROR.Println(err)
		return c.Redirect(Application.Index)
	}

	myroom := chatroom.GetRoom()

	subscription := myroom.Subscribe()
	defer myroom.Unsubscribe(subscription)

	myroom.Join(user)
	defer myroom.Leave(user)

	// 自分自身のソケットから来る発言を受け取るチャンネル
	myself := make(chan string)
	// 自分自身のソケットから来る発言を流すgoroutineを流す
	go listenMyself(ws, myself)

	// トゥッティ!　私たちが心を奪う!!
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
			// 自分のソケットからの送信をproxyするチャンネルを受ける.
			if !ok {
				revel.INFO.Println("myselfチャンネルがcloseしていれば、このループを終了してdeferを呼ぶ")
				return nil
			}
			myroom.Say(user, msg)
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
		revel.INFO.Println(msg, &msg)
		reciever <- msg
	}
}
