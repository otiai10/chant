package bot

import (
	"chant/app/models"
	"regexp"
)

// WhoamiHandler ...
type WhoamiHandler struct {
	*regexp.Regexp
}

// Match ...
func (h WhoamiHandler) Match(event *models.Event) bool {
	return h.MatchString(event.Raw)
}

// Handle ...
func (h WhoamiHandler) Handle(event *models.Event, b *models.User) *models.Event {
	wait()
	return models.NewMessage(b, Messages.Format("whoami", "@"+event.User.ScreenName))
}
