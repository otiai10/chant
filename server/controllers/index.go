package controllers

import (
	"net/http"

	"google.golang.org/appengine"
	"google.golang.org/appengine/log"

	"github.com/otiai10/chant/server/filters"
	"github.com/otiai10/chant/server/models"
	"github.com/otiai10/marmoset"
)

// Index for "/"
func Index(w http.ResponseWriter, r *http.Request) {

	ctx := appengine.NewContext(r)

	user, ok := marmoset.Context().Get(r).Value(filters.AuthKey).(*models.User)

	log.Debugf(ctx, "USER!!!!\n\n%+v\n\n%v\n\n", user, ok)

	marmoset.Render(w).HTML("index", marmoset.P{
		"title": "CHANT",
		"user":  user,
	})
}
