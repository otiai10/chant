package models

import jwt "github.com/dgrijalva/jwt-go"

// User represents each user of this service.
type User struct {
	jwt.StandardClaims `datastore:"-"`
	ScreenName         string `json:"screen_name"`
	ProfileImageURL    string `json:"profile_image_url"`
	ID                 int64  `json:"id"`
	IDString           string `json:"id_str"`
}
