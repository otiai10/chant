package jwtoken

import jwt "github.com/dgrijalva/jwt-go"

// CookieName ...
const CookieName = "chant-client-token"

// JWTokenizer ...
type JWTokenizer struct {
	method string
	salt   string
}

// New ...
func New(salt, method string) JWTokenizer {
	return JWTokenizer{
		method: method,
		salt:   salt,
	}
}

// Encode ...
func (t JWTokenizer) Encode(claims jwt.Claims) (string, error) {
	token := jwt.NewWithClaims(jwt.GetSigningMethod(t.method), claims)
	return token.SignedString([]byte(t.salt))
}

// Decode ...
func (t JWTokenizer) Decode(s string, dest jwt.Claims) error {
	_, err := jwt.ParseWithClaims(s, dest, func(token *jwt.Token) (interface{}, error) {
		return []byte(t.salt), nil
	})
	return err
}
