package bot

import (
	"chant/app/models"
	"regexp"
)

// OppaiHandler ...
type OppaiHandler struct {
	*regexp.Regexp
}

// Match ...
func (h OppaiHandler) Match(event *models.Event) bool {
	return h.MatchString(event.Raw)
}

// Handle ...
func (h OppaiHandler) Handle(event *models.Event, b *models.User) *models.Event {
	wait()
	return models.NewMessage(b, "おっぱいな")
}
