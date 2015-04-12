package factory

import "chant/app/models"

// UserFromSession ...
func UserFromSession(sess map[string]string) (user *models.User, err error) {
	screenName, _ := sess["screenName"]
	profileImageURL, _ := sess["profileImageUrl"]
	name, _ := sess["name"]
	user = &models.User{
		Name:            name,
		ScreenName:      screenName,
		ProfileImageURL: profileImageURL,
	}
	return
}
