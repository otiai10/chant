package bot

import (
	"chant/app/lib/soundcloud"
	"chant/app/models"
	"fmt"
	"math/rand"
	"time"
)

// SoundCloudHandler ...
type SoundCloudHandler struct {
	HandlerBase
}

// Handle ...
func (h SoundCloudHandler) Handle(event *models.Event, b *models.User) *models.Event {

	wg := delay()
	defer wg.Wait()

	q := h.ReplaceAllString(event.Raw, "")
	client := &soundcloud.Client{config.SoundCloud.ClientID}

	tracks, err := client.SearchTracks(q)

	if err != nil {
		return models.NewMessage(b, fmt.Sprintf("すまん: %v", err))
	}
	rand.Seed(time.Now().Unix())
	return models.NewMessage(b, tracks[rand.Intn(len(tracks))].URL)
}

// Help ...
func (h SoundCloudHandler) Help() string {
	return "サウンドクラウドの検索はクソだ"
}
