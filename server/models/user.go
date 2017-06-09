package models

import (
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
	LoginTime  time.Time `json:"login_time"`
	Connection int       `json:"connection"`
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
	ref := user.Ref(ctx)
	if err := ref.Value(user); err != nil {
		return err
	}
	user.Connection++
	if err := ref.Write(user); err != nil {
		return err
	}
	return nil
}

// Leave ...
func (user *User) Leave(ctx context.Context) error {
	ref := user.Ref(ctx)
	if err := ref.Value(user); err != nil {
		return err
	}
	user.Connection--
	if user.Connection < 0 {
		user.Connection = 0
	}
	if err := ref.Write(user); err != nil {
		return err
	}
	return nil
}

// Ref ...
func (user *User) Ref(ctx context.Context) *firebase.Reference {
	url := os.Getenv("FIREBASE_DB_URL") + path.Join("/members", user.ID)
	auth := os.Getenv("FIREBASE_DEPRECATED_DATABASE_SECRETS")
	ref := firebase.NewReference(url).Auth(auth)
	ref.Client = middleware.HTTPClient(ctx)
	return ref
}
