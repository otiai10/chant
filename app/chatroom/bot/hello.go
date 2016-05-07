package bot

import (
	"chant/app/lib/google"
	"chant/app/models"
	"container/list"
	"math/rand"
	"time"
)

// HelloHandler ...
type HelloHandler struct {
	HandlerBase
}

// Handle ...
func (h HelloHandler) Handle(event *models.Event, b *models.User, _ *list.List) *models.Event {

	wg := delay()
	defer wg.Wait()

	rand.Seed(time.Now().Unix())
	if rand.Intn(5) == 0 {
		client := &google.Client{
			APIKey:               config.Google.APIKey,
			CustomSearchEngineID: config.Google.DefaultCseID,
		}
		if resp, err := client.SearchImage("進捗どうですか", 1); err == nil {
			return models.NewMessage(b, resp.Random().URL)
		}
	}
	return models.NewMessage(b, Messages.Get("hello"))
}

// Help ...
func (h HelloHandler) Help() string {
	return "進捗どうですか"
}
