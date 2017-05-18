package controllers

import (
	"fmt"
	"net/http"
	"time"

	"google.golang.org/appengine"
	"google.golang.org/appengine/log"

	"github.com/mrjones/oauth"
	"github.com/otiai10/chant/provider"
	"github.com/otiai10/marmoset"
)

// Auth handles starting point for OAuth communication.
// This endpoint is hit intentionally from "/login"
func Auth(w http.ResponseWriter, r *http.Request) {

	// {{{ AppEngine Specific code
	ctx := appengine.NewContext(r)
	provider.SharedInstance.SetContext(ctx)
	// }}}

	requestToken, url, err := provider.SharedInstance.GetRequestTokenAndUrl("http://localhost:8080/auth/callback")

	if err != nil {
		marmoset.Render(w).HTML("login", marmoset.P{
			"error": err,
		})
		return
	}

	// Store as Cookies
	http.SetCookie(w, &http.Cookie{
		Name:  "chant_twitter_request_token",
		Value: requestToken.Token, Path: "/",
		Expires: time.Now().Add(1 * time.Minute),
	})
	http.SetCookie(w, &http.Cookie{
		Name:  "chant_twitter_request_secret",
		Value: requestToken.Secret, Path: "/",
		Expires: time.Now().Add(1 * time.Minute),
	})

	http.Redirect(w, r, url, http.StatusFound)
}

// AuthCallback handles callback request from Twitter,
// after users accept authentication request by CHANT.
func AuthCallback(w http.ResponseWriter, r *http.Request) {

	// {{{ AppEngine Specific code
	ctx := appengine.NewContext(r)
	provider.SharedInstance.SetContext(ctx)
	// }}}

	verifier := r.FormValue("oauth_verifier")
	if verifier == "" {
		panic(fmt.Errorf("TODO: Error Handling: %s", "No `oauth_verifier given to callback`"))
	}

	token, err := r.Cookie("chant_twitter_request_token")
	if err != nil {
		panic(fmt.Errorf("TODO: Error Handling: %v", err))
	}

	secret, err := r.Cookie("chant_twitter_request_secret")
	if err != nil {
		panic(fmt.Errorf("TODO: Error Handling: %v", err))
	}

	// Restore RequestToken from Cookies
	rtoken := &oauth.RequestToken{Token: token.Value, Secret: secret.Value}

	// Request AccessToken by this RequestToken and verifier just granted
	accesstoken, err := provider.SharedInstance.AuthorizeToken(rtoken, verifier)
	if err != nil {
		panic(fmt.Errorf("TODO: Error Handling: %v", err))
	}

	// Flush Unnecessary Cookies
	http.SetCookie(w, &http.Cookie{
		Name:  "chant_twitter_request_token",
		Value: "", Path: "/", Expires: time.Time{},
	})
	http.SetCookie(w, &http.Cookie{
		Name:  "chant_twitter_request_secret",
		Value: "", Path: "/", Expires: time.Time{},
	})

	identity, err := provider.SharedInstance.FetchIdentity(accesstoken)
	if err != nil {
		panic(fmt.Errorf("TODO: Error Handling: %v", err))
	}

	log.Debugf(ctx, "FETCHED IDENTITY:\n%+v\n\n", identity)

	http.Redirect(w, r, "/", http.StatusFound)
}
