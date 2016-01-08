package bot

import (
	"chant/app/lib/google"
	"chant/app/models"
	"fmt"
)

// ImageHandler ...
type ImageHandler struct {
	HandlerBase
}

// Handle ...
func (h ImageHandler) Handle(event *models.Event, b *models.User) *models.Event {

	wg := delay()
	defer wg.Wait()

	q := h.ReplaceAllString(event.Raw, "")

	client := &google.Client{
		APIKey:               config.Google.APIKey,
		CustomSearchEngineID: config.Google.DefaultCseID,
	}
	// resp, err := google.SearchImage(q)
	resp, err := client.SearchImage(q)
	if err != nil {
		return models.NewMessage(b, fmt.Sprintf("すまん: %v", err))
	}
	entry := resp.Random()
	return models.NewMessage(b, entry.URL)
}

// Help ...
func (h ImageHandler) Help() string {
	return "画像検索してくるやつ"
}
