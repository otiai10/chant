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
