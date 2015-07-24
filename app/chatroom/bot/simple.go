package bot

import (
	"chant/app/models"
	"regexp"
)

// SimpleHandler ...
type SimpleHandler struct {
	*regexp.Regexp
	key string
}

// Match ...
func (h SimpleHandler) Match(event *models.Event) bool {
	return h.MatchString(event.Raw)
}

// Handle ...
func (h SimpleHandler) Handle(event *models.Event, b *models.User) *models.Event {
	wait()
	return models.NewMessage(b, Messages.Get(h.key))
}
