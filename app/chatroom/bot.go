package chatroom

import (
	"chant/app/lib/google"
	"chant/app/models"
	"fmt"
	"strings"
	"time"
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
		return room.newBotMessage("おっぱいな")
	case strings.HasPrefix(event.Raw, "/hello"):
		return room.newBotMessage("おう、どうした")
	case strings.HasPrefix(event.Raw, "/image "):
		q := strings.Replace(event.Raw, "/image ", "", -1)
		resp, err := google.SearchImage(q)
		if err != nil {
			return room.newBotMessage(fmt.Sprintf("すまん: %v", err))
		}
		entry := resp.Random()
		return room.newBotMessage(entry.URL)
	}
	return nil
}

func (room *Room) newBotMessage(text string) *models.Event {
	return &models.Event{
		User: room.Bot,
		Type: models.MESSAGE,
		Value: map[string]interface{}{
			"text": text,
		},
		Timestamp: time.Now().UnixNano(),
	}
}
