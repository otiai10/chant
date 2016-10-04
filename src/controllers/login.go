package controllers

import (
	"net/http"

	m "github.com/otiai10/marmoset"
)

// Login ...
func Login(w http.ResponseWriter, r *http.Request) {
	m.Render(w).HTML("login", m.P{})
}
