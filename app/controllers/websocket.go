package controllers

import (
	"chant/app/chatroom"
	"chant/app/models"

	"github.com/revel/revel"
	"golang.org/x/net/websocket"
)

// ChantSocket is controller to keep socket connection.
type ChantSocket struct {
	*revel.Controller
}

// RoomSocket handles `GET /websocket/room/socket` and `websocket connection`
// websocketが繋がったときの挙動を定義している
func (c ChantSocket) RoomSocket(ws *websocket.Conn, id, token string, tz string) revel.Result {

	// セッション無きものは去れ
	user, err := models.RestoreUserFromJSON(c.Session["user_raw"])
	if err != nil {
		revel.ERROR.Println(err)
		return c.Redirect(Application.Index)
	}

	// タイムゾーン情報の付加. タイムゾーンはsocket connectionごとに決めようね的な
	user.Timezone = tz

	myroom := chatroom.GetRoom("default", token)

	// 自分の参加をroomに表明し、新着イベントの購読チャンネルを委譲してもらう
	subscription := myroom.Subscribe(user)

	// 自分自身のJoinを確実に自分に伝えるために、Subscribeのあとに独自で呼ぶ
	websocket.JSON.Send(ws, myroom.Join(user))

	defer func() {
		// 自分のLeaveを自分に送ってロックしてしまうので、drainをさきに呼ぶ
		myroom.Unsubscribe(subscription)
		myroom.Leave(user)

		// いらなくなったsocket connectionのIOはちゃんとcloseする
		ws.Close()
	}()

	// 自分自身のソケットから来る発言を受け取るチャンネル
	myself := make(chan string)

	// 自分自身のソケットから来る発言を流すgoroutineを流す
	go listenMyself(ws, myself)

	// トゥッティ!　私たちが心を奪う!!
	for {
		select {

		// だれかからのイベント受け取りの処理
		// chatroomへのsubscriptionから新しいイベントが出てきたら
		// それを自分のwebsocketに流し込む
		case event := <-subscription.New:
			if websocket.JSON.Send(ws, &event) != nil {
				return nil // websocket.JSON.Sendに失敗したら、このループを終了してdeferを呼ぶ
			}

		// 自分からのイベントの発信処理
		// 自分自身のsocketをlistenしているチャンネルからなにかしらのメッセージが出てきたら
		// roomへそれを伝える
		case msg, ok := <-myself:
			if !ok {
				return nil // myselfチャンネルがcloseしていれば、このループを終了してdeferを呼ぶ
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
