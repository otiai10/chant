package bot

import (
	"chant/app/models"
	"fmt"
	"strings"

	c "chant/conf"
)

// KickHandler ...
type KickHandler struct {
	HandlerBase
}

// Handle ...
func (h KickHandler) Handle(event *models.Event, b *models.User) *models.Event {
	name := strings.Replace(h.ReplaceAllString(event.Raw, ""), "@", "", -1)
	if err := c.Kick(name); err != nil {
		return models.NewMessage(b, fmt.Sprintf("すまんエラー: %v", err))
	}
	return models.NewMessage(b, fmt.Sprintf("%sさんをkickした", name))
}
