package bot

import (
	"chant/app/models"
	"fmt"

	c "chant/conf"
)

// ListHandler ...
type ListHandler struct {
	HandlerBase
}

// Match ...
func (h ListHandler) Match(event *models.Event) bool {
	return h.MatchString(event.Raw)
}

// Handle ...
func (h ListHandler) Handle(event *models.Event, b *models.User) *models.Event {
	whitelist := c.Whitelist()
	blacklist := c.Blacklist()
	return models.NewMessage(b, fmt.Sprintf("whitelist: %v\nblacklist: %v\n", whitelist, blacklist))
}
