package models

import (
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/otiai10/chant/provider"
)

// User ...
type User struct {
	provider.Identity
	jwt.StandardClaims
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
