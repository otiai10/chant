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
	http.SetCookie(w, &http.Cookie{
		Name:  "chant_identity_token",
		Value: "", Path: "/", Expires: time.Now(),
	})
	http.Redirect(w, r, "/", http.StatusFound)
}

// Join for "POST /join"
func Join(w http.ResponseWriter, r *http.Request) {
	user := filters.RequestUser(r)
	ctx := middleware.Context(r)
	if err := user.Join(ctx); err != nil {
		middleware.Log(ctx).Debugf("Failed to join: %v", err)
	}
	marmoset.Render(w).JSON(http.StatusOK, marmoset.P{})
}

// Leave for "POST /leave"
func Leave(w http.ResponseWriter, r *http.Request) {
	user := filters.RequestUser(r)
	ctx := middleware.Context(r)
	if err := user.Leave(ctx); err != nil {
		middleware.Log(ctx).Debugf("Failed to leave: %v", err)
	}
	marmoset.Render(w).JSON(http.StatusOK, marmoset.P{})
}
