package factory

import "chant/app/models"

func UserFronSession(sess map[string]string) (user *model.User, err error) {
	screenName, _ := sess["screenName"]
	profileImageUrl, _ := sess["profileImageUrl"]
	name, _ := sess["name"]
	user = &model.User{
		Name:            name,
		ScreenName:      screenName,
		ProfileImageUrl: profileImageUrl,
	}
	return
}
