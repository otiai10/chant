package controllers

import (
	"fmt"
	"net/http"
	"os"

	"github.com/otiai10/marmoset"
)

// Index ...
func Index(w http.ResponseWriter, r *http.Request) {
	marmoset.Render(w).HTML("index", marmoset.P{
		"test": os.Getenv("MY_VAR"),
	})
}

// HealthCheck ...
func HealthCheck(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "ok")
}
