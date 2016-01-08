package bot

import (
	"chant/app/models"
	"fmt"
	"net/url"
)

// MapHandler ...
type MapHandler struct {
	HandlerBase
}

// Handle ...
func (h MapHandler) Handle(event *models.Event, b *models.User) *models.Event {

	wait()

	q := h.ReplaceAllString(event.Raw, "")
	msg := fmt.Sprintf("https://www.google.co.jp/maps/place/%s/", url.QueryEscape(q))
	return models.NewMessage(b, msg)
}

// Help ...
func (h MapHandler) Help() string {
	return "場所検索してGoogleMapを表示するやつ"
}
