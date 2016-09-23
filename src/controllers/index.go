package controllers

import (
	"net/http"

	"google.golang.org/appengine"
	"google.golang.org/appengine/channel"
	"google.golang.org/appengine/user"

	m "github.com/otiai10/marmoset"
)

var uids = []string{}

// Index ...
func Index(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	u := user.Current(ctx)
	uids = append(uids, u.String())
	token, err1 := channel.Create(ctx, u.String())
	m.Render(w).HTML("index", m.P{
		// "foo":   m.Context().Get(r).Value("chant-sid"),
		"user":  u,
		"token": token,
		"err1":  err1,
	})
}

// Hello ...
func Hello(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	for _, uid := range uids {
		channel.SendJSON(ctx, uid, m.P{})
	}
	// m.Render(w).JSON(http.StatusCreated, m.P{
	// 	"foo": "なんだね",
	// })
}
