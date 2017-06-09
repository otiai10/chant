package bot

import (
	"chant/app/models"
	"container/list"
	"regexp"
	"time"
)

// LiveHandler ...
type LiveHandler struct {
	HandlerBase
}

// Handle ...
func (h LiveHandler) Handle(event *models.Event, b *models.User, _ *list.List) *models.Event {

	q := h.ReplaceAllString(event.Raw, "")
	exp := regexp.MustCompile("([a-z-]+):([a-zA-Z0-9_-]+)")
	matched := exp.FindAllStringSubmatch(q, -1)

	if len(matched) == 0 || len(matched[0]) < 3 {
		return models.NewMessage(b, "エラーだわ")
	}

	platform := matched[0][1]
	channel := matched[0][2]

	return &models.Event{
		Type: models.LIVEON,
		Value: map[string]interface{}{
			"platform": platform,
			"channel":  channel,
			"url":      "",
		},
		Params: map[string]interface{}{
			"platform": platform,
			"channel":  channel,
			"url":      "",
		},
		Timestamp: time.Now().UnixNano(),
		User:      event.User,
	}
}

// Help ...
func (h LiveHandler) Help() string {
	return "UstとかTwitchのLiveを展開するやつ"
}
