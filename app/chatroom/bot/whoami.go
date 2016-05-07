package bot

import (
	"chant/app/models"
	"container/list"
)

// WhoamiHandler ...
type WhoamiHandler struct {
	HandlerBase
}

// Handle ...
func (h WhoamiHandler) Handle(event *models.Event, b *models.User, _ *list.List) *models.Event {
	wait()
	return models.NewMessage(b, Messages.Format("whoami", "@"+event.User.ScreenName))
}

// Help ...
func (h WhoamiHandler) Help() string {
	return "ねぼけるな"
}
