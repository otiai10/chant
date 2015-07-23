package chatroom

import (
	"chant/app/lib/amesh"
	"chant/app/lib/google"
	"chant/app/models"
	"fmt"
	"net/http"
	"regexp"
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

var (
	imgExp   = regexp.MustCompile("^image/.+")
	commands = map[string]*regexp.Regexp{
		"icon": regexp.MustCompile("^/icon[ 　]+"),
	}
)

//BotHandle ...
func (room *Room) BotHandle(event *models.Event) *models.Event {
	switch {
	case commands["icon"].MatchString(event.Raw):
		u := commands["icon"].ReplaceAllString(event.Raw, "")
		if u == "" {
			room.Bot.ProfileImageURL = "/public/img/hisyotan.png"
			return nil
		}
		resp, err := http.Get(u)
		if err != nil {
			return models.NewMessage(room.Bot, fmt.Sprintf("しっぱいした: %v", err))
		}
		if !imgExp.MatchString(resp.Header.Get("Content-Type")) {
			return models.NewMessage(room.Bot, fmt.Sprintf("がぞうじゃなくね？"))
		}
		room.Bot.ProfileImageURL = u
		return models.NewMessage(room.Bot, "変えました")
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
	case strings.HasPrefix(event.Raw, "/amesh"):
		entry := amesh.Get()
		time.Sleep(500 * time.Millisecond)
		return &models.Event{
			User:      room.Bot,
			Type:      models.AMESH,
			Raw:       amesh.URL,
			Value:     entry,
			Timestamp: time.Now().UnixNano(),
		}
	}
	return nil
}
