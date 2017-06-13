package controllers

import (
	"net/http"
	"os"
	"time"

	"github.com/otiai10/chant/server/filters"
	"github.com/otiai10/chant/server/middleware"
	"github.com/otiai10/chant/server/models"
	"github.com/otiai10/marmoset"
)

// Index for "/"
func Index(w http.ResponseWriter, r *http.Request) {

	ctx := middleware.Context(r)

	user, _ := marmoset.Context().Get(r).Value(filters.AuthKey).(*models.User)
	user.Join(ctx)

	firebaseconfig := getFirebaseConfig(r)
	flushUnnecessaryCookies(w)

	marmoset.Render(w).HTML("index", marmoset.P{
		"title": "CHANT",
		"user":  user,
		"configs": map[string]interface{}{
			"firebase": firebaseconfig,
		},
	})
}

func getFirebaseConfig(r *http.Request) models.FirebaseConfigEmbed {

	firebaseembed := models.FirebaseConfigEmbed{
		APIKey:            os.Getenv("FIREBASE_API_KEY"),
		AuthDomain:        os.Getenv("FIREBASE_AUTH_DOMAIN"),
		DatabaseURL:       os.Getenv("FIREBASE_DB_URL"),
		ProjectID:         os.Getenv("FIREBASE_PROJECT_ID"),
		StorageBucket:     os.Getenv("FIREBASE_STORAGE_BUCKET"),
		MessagingSenderID: os.Getenv("FIREBASE_MESSAGING_SENDER_ID"),
	}

	// DelegatedAccess NEVER should be embeded unless this is the first access to CHANT.
	// This is embeded ONLY for "firebase SDK client-side credentialing".
	// See https://firebase.google.com/docs/auth/web/twitter-login#handle_the_sign-in_flow_manually for more information.
	token, err1 := r.Cookie("tmp_chant_access_token")
	secret, err2 := r.Cookie("tmp_chant_access_secret")
	if err1 == nil && err2 == nil {
		firebaseembed.Delegated = &models.DelegatedAccess{Token: token.Value, Secret: secret.Value}
	}

	return firebaseembed
}

func flushUnnecessaryCookies(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name: "tmp_chant_access_token", Value: "", Path: "/", Expires: time.Now(),
	})
	http.SetCookie(w, &http.Cookie{
		Name: "tmp_chant_access_secret", Value: "", Path: "/", Expires: time.Now(),
	})
}
