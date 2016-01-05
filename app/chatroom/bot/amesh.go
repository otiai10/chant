package bot

import (
	"chant/app/lib/amesh"
	"chant/app/models"
	"time"
)

// AmeshHandler ...
type AmeshHandler struct {
	HandlerBase
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

// Help ...
func (h AmeshHandler) Help() string {
	return "アメッシュ表示するやつ"
}
