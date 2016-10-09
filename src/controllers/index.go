package controllers

import (
	"encoding/json"
	"net/http"

	"google.golang.org/appengine"
	"google.golang.org/appengine/channel"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/user"

	"github.com/otiai10/chant/src/models"
	m "github.com/otiai10/marmoset"
)

// Identity Pool
var uids = map[string]*user.User{}

// Index ...
func Index(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	user, ok := m.Context().Get(r).Value("current_user").(*models.User)
	if !ok {
		m.RenderJSON(w, http.StatusForbidden, m.P{
			"errors": []interface{}{map[string]interface{}{"message": "cannot retrieve login data"}},
		})
		return
	}
	log.Infof(ctx, "foobar")
	m.Render(w).HTML("index", m.P{
		"myself": user,
		"foo":    "foobar",
	})
}

// Message ...
func Message(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	body := struct {
		Message string `json:"message"`
	}{}
	json.NewDecoder(r.Body).Decode(&body)
	for _, u := range uids {
		channel.SendJSON(ctx, u.String(), m.P{
			"message": body.Message,
		})
	}
}
