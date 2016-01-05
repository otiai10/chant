package bot

import "chant/app/models"

// WhoamiHandler ...
type WhoamiHandler struct {
	HandlerBase
}

// Handle ...
func (h WhoamiHandler) Handle(event *models.Event, b *models.User) *models.Event {
	wait()
	return models.NewMessage(b, Messages.Format("whoami", "@"+event.User.ScreenName))
}

// Help ...
func (h WhoamiHandler) Help() string {
	return "ねぼけるな"
}
