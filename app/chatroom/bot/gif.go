package bot

import (
	"chant/app/lib/google"
	"chant/app/models"
	"fmt"
)

// GifHandler ...
type GifHandler struct {
	HandlerBase
}

// Handle ...
func (h GifHandler) Handle(event *models.Event, b *models.User) *models.Event {

	wg := delay()
	defer wg.Wait()

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

// Help ...
func (h GifHandler) Help() string {
	return "GIFアニメさがしてくるやつ"
}
