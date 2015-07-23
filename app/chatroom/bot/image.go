package bot

import (
	"chant/app/lib/google"
	"chant/app/models"
	"fmt"
	"regexp"
)

// ImageHandler ...
type ImageHandler struct {
	*regexp.Regexp
}

// Match ...
func (h ImageHandler) Match(event *models.Event) bool {
	return h.MatchString(event.Raw)
}

// Handle ...
func (h ImageHandler) Handle(event *models.Event, b *models.User) *models.Event {
	q := h.ReplaceAllString(event.Raw, "")
	resp, err := google.SearchImage(q)
	if err != nil {
		return models.NewMessage(b, fmt.Sprintf("すまん: %v", err))
	}
	entry := resp.Random()
	return models.NewMessage(b, entry.URL)
}
