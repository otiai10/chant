package controllers

import (
	"chant.v1/app/chatroom"
	"chant.v1/app/models"

	"chant.v1/app/repository"
	"github.com/revel/revel"
	"golang.org/x/net/websocket"
)

// ChantSocket is controller to keep socket connection.
type ChantSocket struct {
	*revel.Controller
}

// RoomSocket handles `GET /websocket/room/socket` and `websocket connection`
// websocketが繋がったときの挙動を定義している
func (c ChantSocket) RoomSocket(ws *websocket.Conn) revel.Result {

	user, err := models.RestoreUserFromJSON(c.Session["user_raw"])
	if err != nil {
		revel.ERROR.Println(err)
		return c.Redirect(Application.Index)
	}

	myroom := chatroom.GetRoom()

	// 自分のJoinを自分に伝えるために、Subscribeのあとに呼ぶ
	subscription := myroom.Subscribe(user)
	myroom.Join(user)
	defer func() {
		// 自分のLeaveを自分に送ってロックしてしまうので、drainをさきに呼ぶ
		myroom.Unsubscribe(subscription)
		myroom.Leave(user)
	}()

	// 自分自身のソケットから来る発言を受け取るチャンネル
	myself := make(chan string)
	// 自分自身のソケットから来る発言を流すgoroutineを流す
	go listenMyself(ws, myself)

	// メッセージアーカイブを、最新の、最大10件を取得する
	for _, event := range repository.GetMessages(10, -1) {
		websocket.JSON.Send(ws, &event)
	}

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
		reciever <- msg
	}
}
