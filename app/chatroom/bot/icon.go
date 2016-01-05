package bot

import (
	"chant/app/models"
	"fmt"
	"net/http"
	"regexp"
)

// IconHandler ...
type IconHandler struct {
	HandlerBase
}

// Handle ...
func (h IconHandler) Handle(event *models.Event, b *models.User) *models.Event {
	u := h.ReplaceAllString(event.Raw, "")
	if u == "" {
		b.ProfileImageURL = "/public/img/hisyotan.png"
		return nil
	}
	res, err := http.Get(u)

	if err != nil {
		return models.NewMessage(b, fmt.Sprintf("しっぱいした: %v", err))
	}
	defer res.Body.Close()

	imgExp := regexp.MustCompile("^image/.+")
	if !imgExp.MatchString(res.Header.Get("Content-Type")) {
		return models.NewMessage(b, fmt.Sprintf("がぞうじゃなくね？"))
	}
	b.ProfileImageURL = u
	return models.NewMessage(b, "変えました")
}

// Help ...
func (h IconHandler) Help() string {
	return "botのアイコンかえるやつ"
}
