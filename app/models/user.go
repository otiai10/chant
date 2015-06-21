package models

import "encoding/json"

// User ユーザ
type User struct {
	IDstr           string `json:"id_str"`
	Name            string `json:"name"`
	ScreenName      string `json:"screen_name"`
	ProfileImageURL string `json:"profile_image_url"`
}

func RestoreUserFromJSON(jsonstr string) (*User, error) {
	user := &User{}
	err := json.Unmarshal([]byte(jsonstr), &user)
	return user, err
}
