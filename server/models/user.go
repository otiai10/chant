package models

import (
	"fmt"
	"os"
	"path"
	"time"

	"context"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/otiai10/chant/provider/identity"
	"github.com/otiai10/chant/server/middleware"
	"github.com/otiai10/firebase"
)

// DeviceName ...
type DeviceName string

const (
	// Chrome represents Chrome Browser
	Chrome DeviceName = "chrome"
	// Firefox represents Firefox Browser
	Firefox DeviceName = "firefox"
)

// User ...
type User struct {
	identity.Identity
	jwt.StandardClaims
	LoginTime    time.Time       `json:"login_time"`
	Browser      int64           `json:"browser"`
	Browsers     map[string]bool `json:"browsers"`
	Notification struct {
		Devices map[DeviceName]struct {
			Token string `json:"token"`
			TS    int64  `json:"ts"`
		} `json:"devices,omitempty"`
	} `json:"notification,omitempty"`
	Timezone *struct {
		Name   string `json:"name"`
		Offset int    `json:"offset"`
	} `json:"timezone"`
}

// Bot provides bot user
func Bot( /* ctx context.Context */ ) *User {
	// TODO: get bot from Firebase Database
	return &User{
		Identity: identity.Identity{
			Name:     "chang",
			Provider: "bot",
			ImageURL: "/public/img/bot.png",
		},
	}
}

// Encode to JWT string
func (user *User) Encode(salt string) (string, error) {
	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), user)
	return token.SignedString([]byte(salt))
}

// DecodeUser from JWT string
func DecodeUser(tokenstring, salt string) (*User, error) {
	user := &User{}
	_, err := jwt.ParseWithClaims(tokenstring, user, func(token *jwt.Token) (interface{}, error) {
		return []byte(salt), nil
	})
	return user, err
}

// Join ...
func (user *User) Join(ctx context.Context) error {
	user.Browser = time.Now().Unix() * 1000
	ref := user.Ref(ctx, "browsers", fmt.Sprintf("%d", user.Browser))
	if err := ref.Write(true); err != nil {
		return err
	}
	return nil
}

// Leave delete user object from remote database completely.
// This is NOT disconnect, meaning it deletes also `notifications`.
func (user *User) Leave(ctx context.Context) error {
	return user.Ref(ctx).Delete()
}

// Ref ...
func (user *User) Ref(ctx context.Context, refpath ...string) *firebase.Reference {
	refpath = append([]string{"/members", user.ID}, refpath...)
	url := os.Getenv("FIREBASE_DB_URL") + path.Join(refpath...)
	auth := os.Getenv("FIREBASE_DEPRECATED_DATABASE_SECRETS")
	ref := firebase.NewReference(url).Auth(auth)
	ref.Client = middleware.HTTPClient(ctx)
	return ref
}

// Members ...
func Members(ctx context.Context) (map[string]*User, error) {
	url := os.Getenv("FIREBASE_DB_URL") + "/members"
	auth := os.Getenv("FIREBASE_DEPRECATED_DATABASE_SECRETS")
	ref := firebase.NewReference(url).Auth(auth)
	ref.Client = middleware.HTTPClient(ctx)
	members := map[string]*User{}
	if err := ref.Value(&members); err != nil {
		return nil, err
	}
	return members, nil
}
