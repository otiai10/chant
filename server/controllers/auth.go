package controllers

import (
	"fmt"
	"net/http"
	"net/url"
	"os"
	"path"
	"time"

	"github.com/mrjones/oauth"
	"github.com/otiai10/chant/provider"
	"github.com/otiai10/chant/server/middleware"
	"github.com/otiai10/chant/server/models"
	"github.com/otiai10/firebase"
	"github.com/otiai10/marmoset"
)

// XXX: We can't use r.URL.Scheme/Host to create callback URL,
//      because "goapp" proxy server remove them.
func getCallbackURL(req *http.Request) string {
	u, err := url.Parse(req.Referer())
	if err == nil {
		return fmt.Sprintf("%s://%s/auth/callback", u.Scheme, req.Host)
	}
	return fmt.Sprintf("%s/auth/callback", req.Header.Get("Origin"))
}

// Auth handles starting point for OAuth communication.
// This endpoint is hit intentionally from "/login"
func Auth(w http.ResponseWriter, r *http.Request) {

	ctx := middleware.Context(r)
	provider.SharedInstance.SetContext(ctx)

	callback := getCallbackURL(r)
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

	ctx := middleware.Context(r)
	provider.SharedInstance.SetContext(ctx)

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
	user := &models.User{Identity: *identity, LoginTime: time.Now()}
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

	// Firebase
	// TODO: DRY
	url := os.Getenv("FIREBASE_DB_URL") + path.Join("/members", user.ID)
	auth := os.Getenv("FIREBASE_DEPRECATED_DATABASE_SECRETS")
	ref := firebase.NewReference(url).Auth(auth)
	ref.Client = middleware.HTTPClient(ctx)
	if err := ref.Write(user); err != nil {
		middleware.Log(ctx).Debugf("CHANT FAILED TO UPDATE `members` entry: %v", err)
	}

	http.Redirect(w, r, "/", http.StatusFound)
}
