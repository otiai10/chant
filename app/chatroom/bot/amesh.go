package bot

import (
	"chant/app/lib/amesh"
	"chant/app/models"
	"regexp"
	"time"
)

// AmeshHandler ...
type AmeshHandler struct {
	*regexp.Regexp
}

// Match ...
func (h AmeshHandler) Match(event *models.Event) bool {
	return h.MatchString(event.Raw)
}

// Handle ...
func (h AmeshHandler) Handle(event *models.Event, b *models.User) *models.Event {
	switch h.ReplaceAllString(event.Raw, "") {
	case "on":
		go AmeshObserver.Start()
		return models.NewMessage(b, "アメッシュ・オン！")
	case "off":
		AmeshObserver.Stop()
		return models.NewMessage(b, "アメッシュ・オフ！")
	}
	entry := amesh.Get()
	wait()
	return &models.Event{
		User:      b,
		Type:      models.AMESH,
		Raw:       amesh.URL,
		Value:     entry,
		Timestamp: time.Now().UnixNano(),
	}
}
