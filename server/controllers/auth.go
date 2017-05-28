package controllers

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"google.golang.org/appengine"

	"github.com/mrjones/oauth"
	"github.com/otiai10/chant/provider"
	"github.com/otiai10/chant/server/models"
	"github.com/otiai10/marmoset"
)

// Auth handles starting point for OAuth communication.
// This endpoint is hit intentionally from "/login"
func Auth(w http.ResponseWriter, r *http.Request) {

	// {{{ AppEngine Specific code
	ctx := appengine.NewContext(r)
	provider.SharedInstance.SetContext(ctx)
	// }}}

	// XXX: We can't use r.URL.Scheme/Host to create callback URL,
	//      because "goapp" proxy server remove them.
	callback := fmt.Sprintf("%s/auth/callback", r.Header.Get("Origin"))
	requestToken, url, err := provider.SharedInstance.GetRequestTokenAndUrl(callback)

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
		Value: "", Path: "/", Expires: time.Now(),
	})
	http.SetCookie(w, &http.Cookie{
		Name:  "chant_twitter_request_secret",
		Value: "", Path: "/", Expires: time.Now(),
	})

	identity, err := provider.SharedInstance.FetchIdentity(accesstoken)
	if err != nil {
		panic(fmt.Errorf("TODO: Error Handling: %v", err))
	}

	// Store Identity, TODO: use Session, instead of Cookie
	user := &models.User{Identity: *identity}
	jwttoken, err := user.Encode(os.Getenv("JWT_SALT"))
	if err != nil {
		panic(fmt.Errorf("TODO: Error Handling: %v", err))
	}
	http.SetCookie(w, &http.Cookie{
		Name:  "chant_identity_token",
		Value: jwttoken, Path: "/",
		Expires: time.Now().Add(480 * time.Hour),
	})

	// {{{ for manual authentication without Firebase in frontend
	http.SetCookie(w, &http.Cookie{
		Name:  "tmp_chant_access_token",
		Value: accesstoken.Token, Path: "/",
		Expires: time.Now().Add(30 * time.Second),
	})
	http.SetCookie(w, &http.Cookie{
		Name:  "tmp_chant_access_secret",
		Value: accesstoken.Secret, Path: "/",
		Expires: time.Now().Add(30 * time.Second),
	})
	// }}}

	http.Redirect(w, r, "/", http.StatusFound)
}
