package controllers

import (
	"encoding/json"
	"net/http"

	"google.golang.org/appengine"
	"google.golang.org/appengine/channel"
	"google.golang.org/appengine/user"

	m "github.com/otiai10/marmoset"
)

// Identity Pool
var uids = map[string]*user.User{}

// Index ...
func Index(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	u := user.Current(ctx)
	uids[u.String()] = u
	token, err1 := channel.Create(ctx, u.String())
	m.Render(w).HTML("index", m.P{
		// "foo":   m.Context().Get(r).Value("chant-sid"),
		"user":  u,
		"token": token,
		"err1":  err1,
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
