package bot

import (
	"chant/app/chatroom/bot/context"
	"chant/app/lib/google"
	"chant/app/models"
	"container/list"
	"fmt"
)

// ImageHandler ...
type ImageHandler struct {
	HandlerBase
}

// Handle ...
func (h ImageHandler) Handle(event *models.Event, b *models.User, _ *list.List) *models.Event {

	wg := delay()
	defer wg.Wait()

	straight := context.Default().Straight(h, 0, nil)

	q := h.ReplaceAllString(event.Raw, "")

	client := &google.Client{
		APIKey:               config.Google.APIKey,
		CustomSearchEngineID: config.Google.DefaultCseID,
	}
	resp, err := client.SearchImage(q, straight)
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
