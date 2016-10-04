package controllers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/otiai10/chant/src/configs"
	"github.com/otiai10/chant/src/lib/jwtoken"
	"github.com/otiai10/chant/src/lib/twitter"
	"github.com/otiai10/chant/src/models"
	m "github.com/otiai10/marmoset"
	"google.golang.org/appengine"
	"google.golang.org/appengine/urlfetch"
)

// AuthTwitterStart is a starting of OAuth dance.
func AuthTwitterStart(w http.ResponseWriter, r *http.Request) {

	ctx := appengine.NewContext(r)

	// if this user already has context, no need to login :)
	user, ok := m.Context().Get(r).Value("current_user").(models.User)
	if ok && user.ScreenName != "" && user.ProfileImageURL != "" {
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	// Get temporary Request Token from provider.
	client := urlfetch.Client(ctx)
	requestToken, url, err := twitter.NewClient(client).GetRequestTokenAndUrl("http://localhost:8080/auth/twitter/callback")
	if err != nil {
		m.Render(w).HTML("errors/500", m.P{
			"errors": []interface{}{map[string]interface{}{"message": err.Error()}},
		})
		return
	}

	// XXX: cookie??
	http.SetCookie(w, &http.Cookie{Name: "request_token", Value: requestToken.Token, Expires: time.Now().Add(1 * time.Minute)})
	http.SetCookie(w, &http.Cookie{Name: "request_secret", Value: requestToken.Secret, Expires: time.Now().Add(1 * time.Minute)})

	// Go to provider's web page.
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

// AuthTwitterCallback is a callback endpoint to which user gets back after finishing Twitter OAuth.
func AuthTwitterCallback(w http.ResponseWriter, r *http.Request) {

	rtoken := twitter.RequestTokenFromHTTPRequest(r)
	defer http.SetCookie(w, &http.Cookie{Name: "request_token", MaxAge: -1})
	defer http.SetCookie(w, &http.Cookie{Name: "request_secret", MaxAge: -1})

	ctx := appengine.NewContext(r)
	tw := twitter.NewClient(urlfetch.Client(ctx))

	atoken, err := tw.AuthorizeToken(rtoken, r.FormValue("oauth_verifier"))
	// YAGNI: It's not necessary to save this access token, for now.

	if err != nil {
		m.Render(w).HTML("errors/500", m.P{
			"errors": []interface{}{map[string]interface{}{"message": err.Error()}},
		})
		return
	}

	resp, err := tw.GetAccount(atoken)
	if err != nil {
		m.Render(w).HTML("errors/500", m.P{
			"errors": []interface{}{map[string]interface{}{"message": err.Error()}},
		})
		return
	}
	defer resp.Body.Close()

	user := new(models.User)
	if err = json.NewDecoder(resp.Body).Decode(user); err != nil {
		m.Render(w).HTML("errors/500", m.P{
			"errors": []interface{}{map[string]interface{}{"message": err.Error()}},
		})
		return
	}

	jsonwebtoken, err := jwtoken.New(configs.JWTSecretSalt(), configs.JWTSigningMethod()).Encode(user)
	if err != nil {
		m.Render(w).HTML("errors/500", m.P{
			"errors": []interface{}{map[string]interface{}{"message": err.Error()}},
		})
		return
	}

	http.SetCookie(w, &http.Cookie{Name: jwtoken.CookieName, Value: jsonwebtoken, Path: "/"})
	http.Redirect(w, r, "/", http.StatusFound)
}
