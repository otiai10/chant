package controllers

import (
	"fmt"
	"net/http"

	"github.com/otiai10/marmoset"
)

// Index ...
func Index(w http.ResponseWriter, r *http.Request) {
	marmoset.Render(w).HTML("index", nil)
}

// HealthCheck ...
func HealthCheck(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "ok")
}
