package controllers

import (
	"net/http"
	"time"

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
