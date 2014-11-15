package controllers

import (
	"chant/app/chatroom"
	"code.google.com/p/go.net/websocket"
	"github.com/revel/revel"

	"chant/app/models"

	"html"
)

type WebSocket struct {
	*revel.Controller
}

func (c WebSocket) RoomSocket(ws *websocket.Conn) revel.Result {

	_, ok := c.Session["screenName"]
	if !ok {
		c.Redirect(Application.Index)
	}

	user := &model.User{
		c.Session["Name"],
		c.Session["screenName"],
		c.Session["profileImageUrl"],
	}

	// Join the room.
	subscription := chatroom.Subscribe()
	defer subscription.Cancel()

	chatroom.Join(user)
	defer chatroom.Leave(user)

	// Send down the archive.
	for _, event := range subscription.Archive {
		if websocket.JSON.Send(ws, &event) != nil {
			// They disconnected
			return nil
		}
	}

	for sound := chatroom.SoundTrack.Front(); sound != nil; sound = sound.Next() {
		if websocket.JSON.Send(ws, &sound.Value) != nil {
			return nil
		}
	}

	for _, stamp := range chatroom.GetStampArchive() {
		if websocket.JSON.Send(ws, stamp) != nil {
			return nil
		}
	}

	// In order to select between websocket messages and subscription events, we
	// need to stuff websocket events into a channel.
	newMessages := make(chan string)
	go func() {
		var msg string
		for {
			err := websocket.Message.Receive(ws, &msg)
			if err != nil {
				close(newMessages)
				return
			}

			if 1024 < len(msg) {
				notification := chatroom.NewEvent(
					"notification",
					user,
					"1024字までですニャン",
				)
				_ = websocket.JSON.Send(ws, notification)
			} else {
				newMessages <- msg
			}
		}
	}()

	// Now listen for new events from either the websocket or the chatroom.
	for {
		select {
		case event := <-subscription.New:
			if websocket.JSON.Send(ws, &event) != nil {
				// They disconnected.
				return nil
			}
		case msg, ok := <-newMessages:
			// If the channel is closed, they disconnected.
			if !ok {
				return nil
			}

			// Otherwise, say something.
			// chatroom.Sayでやるべきな気がするけれど
			escaped := html.EscapeString(msg)
			chatroom.Say(user, escaped)
		}
	}
	return nil
}
