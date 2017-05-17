package controllers

import (
	"net/http"

	"github.com/otiai10/marmoset"
)

// Index for "/"
func Index(w http.ResponseWriter, r *http.Request) {
	marmoset.Render(w).HTML("index", marmoset.P{
		"title": "CHANT",
	})
}
