package controllers

import (
	"net/http"
	"os"

	"github.com/otiai10/chant/server/filters"
	"github.com/otiai10/chant/server/models"
	"github.com/otiai10/marmoset"
)

// Index for "/"
func Index(w http.ResponseWriter, r *http.Request) {

	user, _ := marmoset.Context().Get(r).Value(filters.AuthKey).(*models.User)

	marmoset.Render(w).HTML("index", marmoset.P{
		"title": "CHANT",
		"user":  user,
		"configs": map[string]interface{}{
			"firebase": models.FirebaseConfigEmbed{
				APIKey:            os.Getenv("FIREBASE_API_KEY"),
				AuthDomain:        os.Getenv("FIREBASE_AUTH_DOMAIN"),
				DatabaseURL:       os.Getenv("FIREBASE_DB_URL"),
				ProjectID:         os.Getenv("FIREBASE_PROJECT_ID"),
				StorageBucket:     os.Getenv("FIREBASE_STORAGE_BUCKET"),
				MessagingSenderID: os.Getenv("FIREBASE_MESSAGING_SENDER_ID"),
			},
		},
	})
}
