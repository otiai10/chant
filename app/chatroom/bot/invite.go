package bot

import (
	"chant/app/models"
	"fmt"
	"strings"

	c "chant/conf"
)

// InviteHandler ...
type InviteHandler struct {
	HandlerBase
}

// Match ...
func (h InviteHandler) Match(event *models.Event) bool {
	return h.MatchString(event.Raw)
}

// Handle ...
func (h InviteHandler) Handle(event *models.Event, b *models.User) *models.Event {
	name := strings.Replace(h.ReplaceAllString(event.Raw, ""), "@", "", -1)
	if err := c.Invite(name); err != nil {
		return models.NewMessage(b, fmt.Sprintf("すまんエラー: %v", err))
	}
	return models.NewMessage(b, fmt.Sprintf("%sさんをinviteした", name))
}
