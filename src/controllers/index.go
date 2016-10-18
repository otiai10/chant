package controllers

import (
	"encoding/json"
	"net/http"

	"google.golang.org/appengine"
	"google.golang.org/appengine/channel"
	"google.golang.org/appengine/log"

	"github.com/otiai10/chant/src/chatroom"
	"github.com/otiai10/chant/src/models"
	m "github.com/otiai10/marmoset"
)

// Index ...
func Index(w http.ResponseWriter, r *http.Request) {

	ctx := appengine.NewContext(r)

	// Get Current User
	user, ok := m.Context().Get(r).Value("current_user").(*models.User)
	if !ok {
		m.RenderJSON(w, http.StatusForbidden, m.P{
			"errors": []interface{}{map[string]interface{}{"message": "cannot retrieve login data"}},
		})
		return
	}

	// Create Token for channel
	subscriberID := user.IDString + r.FormValue("channel")
	channeltoken, err := channel.Create(ctx, subscriberID)
	if err != nil {
		m.RenderJSON(w, http.StatusForbidden, m.P{
			"errors": []interface{}{map[string]interface{}{"message": "cannot retrieve login data"}},
		})
		return
	}

	// TODO: Error handling
	room, _ := chatroom.GetRoom(ctx, "default")

	// Add subscribers
	room.AddMember(user, channeltoken)
	err = room.Save(ctx)
	log.Errorf(ctx, "room.Save: %v", err)

	m.Render(w).HTML("index", m.P{
		"myself":       user,
		"channeltoken": channeltoken,
	})

}

// Message ...
func Message(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	body := struct {
		Text string `json:"text"`
	}{}
	json.NewDecoder(r.Body).Decode(&body)
	// TODO: Error handling
	room, _ := chatroom.GetRoom(ctx, "default")

	log.Infof(ctx, "room: %v\n", room)
	for _, subscribeID := range room.Subscribers {
		channel.SendJSON(ctx, subscribeID, m.P{
			"text": body.Text,
		})
	}
}
