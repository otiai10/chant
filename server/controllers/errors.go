package controllers

import (
	"net/http"

	"github.com/otiai10/marmoset"
)

// Forbidden handles 403
func Forbidden(w http.ResponseWriter, r *http.Request) {
	marmoset.Render(w).HTML("errors/403", nil)
}
