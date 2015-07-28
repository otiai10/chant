package bot

import (
	"chant/app/lib/soundcloud"
	"chant/app/models"
	"fmt"
	"math/rand"
	"regexp"
	"time"
)

// SoundCloudHandler ...
type SoundCloudHandler struct {
	*regexp.Regexp
}

// Match ...
func (h SoundCloudHandler) Match(event *models.Event) bool {
	return h.MatchString(event.Raw)
}

// Handle ...
func (h SoundCloudHandler) Handle(event *models.Event, b *models.User) *models.Event {
	q := h.ReplaceAllString(event.Raw, "")
	client := &soundcloud.Client{"3f4831d902a9686ec6293ed8dd547cd5"}

	tracks, err := client.SearchTracks(q)

	if err != nil {
		return models.NewMessage(b, fmt.Sprintf("すまん: %v", err))
	}
	rand.Seed(time.Now().Unix())
	return models.NewMessage(b, tracks[rand.Intn(len(tracks))].URL)
}
