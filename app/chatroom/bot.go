package chatroom

import (
	"chant/app/lib/google"
	"chant/app/models"
	"fmt"
	"strings"
)

// DefaultBot ...
func DefaultBot() *models.User {
	return &models.User{
		IDstr:           "unknown",
		Name:            "秘書たん",
		ScreenName:      "hisyotan",
		ProfileImageURL: "/public/img/hisyotan.png",
	}
}

//BotHandle ...
func (room *Room) BotHandle(event *models.Event) *models.Event {
	switch {
	case strings.HasPrefix(event.Raw, "/oppai"):
		return models.NewMessage(room.Bot, "おっぱいな")
	case strings.HasPrefix(event.Raw, "/hello"):
		return models.NewMessage(room.Bot, "おう、どうした")
	case strings.HasPrefix(event.Raw, "/image "):
		q := strings.Replace(event.Raw, "/image ", "", -1)
		resp, err := google.SearchImage(q)
		if err != nil {
			return models.NewMessage(room.Bot, fmt.Sprintf("すまん: %v", err))
		}
		entry := resp.Random()
		return models.NewMessage(room.Bot, entry.URL)
	}
	return nil
}
