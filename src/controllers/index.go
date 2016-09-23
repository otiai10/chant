package controllers

import (
	"net/http"

	m "github.com/otiai10/marmoset"
)

// Index ...
func Index(w http.ResponseWriter, r *http.Request) {
	m.Render(w).HTML("index", m.P{
		"foo": m.Context().Get(r).Value("chant-sid"),
	})
}
