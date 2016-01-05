package bot

import (
	"chant/app/lib/google"
	"chant/app/models"
	"math/rand"
	"time"
)

// HelloHandler ...
type HelloHandler struct {
	HandlerBase
}

// Handle ...
func (h HelloHandler) Handle(event *models.Event, b *models.User) *models.Event {
	rand.Seed(time.Now().Unix())
	if rand.Intn(3) == 0 {
		if resp, err := google.SearchImage("進捗どうですか"); err == nil {
			return models.NewMessage(b, resp.Random().URL)
		}
	}
	wait()
	return models.NewMessage(b, Messages.Get("hello"))
}
