package bot

import (
	"chant/app/models"
	"regexp"
)

// HelloHandler ...
type HelloHandler struct {
	*regexp.Regexp
}

// Match ...
func (h HelloHandler) Match(event *models.Event) bool {
	return h.MatchString(event.Raw)
}

// Handle ...
func (h HelloHandler) Handle(event *models.Event, b *models.User) *models.Event {
	wait()
	return models.NewMessage(b, "おう、どうした")
}
