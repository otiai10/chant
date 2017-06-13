package models

import (
	"fmt"
	"os"
	"path"
	"time"

	"golang.org/x/net/context"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/otiai10/chant/provider"
	"github.com/otiai10/chant/server/middleware"
	"github.com/otiai10/firebase"
)

// User ...
type User struct {
	provider.Identity
	jwt.StandardClaims
	LoginTime time.Time `json:"login_time"`
	Browser   int64     `json:"browser"`
	Browsers  []int64   `json:"browsers"`
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

// Ref ...
func (user *User) Ref(ctx context.Context, refpath ...string) *firebase.Reference {
	refpath = append([]string{"/members", user.ID}, refpath...)
	url := os.Getenv("FIREBASE_DB_URL") + path.Join(refpath...)
	auth := os.Getenv("FIREBASE_DEPRECATED_DATABASE_SECRETS")
	ref := firebase.NewReference(url).Auth(auth)
	ref.Client = middleware.HTTPClient(ctx)
	return ref
}
