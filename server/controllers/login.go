package controllers

import (
	"net/http"

	"github.com/otiai10/marmoset"
)

// Login for "/login"
func Login(w http.ResponseWriter, r *http.Request) {
	marmoset.Render(w).HTML("login", marmoset.P{})
}
