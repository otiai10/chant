package controllers

import (
	"net/http"

	m "github.com/otiai10/marmoset"
)

// Index ...
func Index(w http.ResponseWriter, req *http.Request) {
	m.Render(w).HTML("index", nil)
}
