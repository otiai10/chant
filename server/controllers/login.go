package controllers

import (
	"net/http"
	"time"

	"github.com/otiai10/chant/server/filters"
	"github.com/otiai10/chant/server/middleware"
	"github.com/otiai10/marmoset"
)

// Login for "GET /login"
func Login(w http.ResponseWriter, r *http.Request) {
	marmoset.Render(w).HTML("login", marmoset.P{})
}

// Logout for "POST /logout"
func Logout(w http.ResponseWriter, r *http.Request) {

	user := filters.RequestUser(r)
	if user == nil {
		return // TODO: return something
	}
	if err := user.Leave(middleware.Context(r)); err != nil {
		return // TODO: return something
	}

	http.SetCookie(w, &http.Cookie{
		Name:  "chant_identity_token",
		Value: "", Path: "/", Expires: time.Now(),
	})
	http.Redirect(w, r, "/", http.StatusFound)
}
