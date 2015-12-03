package bot

import (
	"chant/app/lib/google"
	"chant/app/models"
	"fmt"
	"regexp"
)

// GifHandler ...
type GifHandler struct {
	*regexp.Regexp
}

// Match ...
func (h GifHandler) Match(event *models.Event) bool {
	return h.MatchString(event.Raw)
}

// Handle ...
func (h GifHandler) Handle(event *models.Event, b *models.User) *models.Event {
	q := h.ReplaceAllString(event.Raw, "")

	client := &google.Client{
		APIKey:               config.Google.APIKey,
		CustomSearchEngineID: config.Google.DefaultCseID,
	}
	resp, err := client.SearchGIF(q)
	if err != nil {
		return models.NewMessage(b, fmt.Sprintf("すまん: %v", err))
	}
	entry := resp.Random()
	return models.NewMessage(b, entry.URL)
}
