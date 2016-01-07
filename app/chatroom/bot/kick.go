package bot

import (
	"chant/app/models"
	"fmt"
	"strings"
	"time"

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
	return &models.Event{
		User:      b,
		Type:      models.KICK,
		Raw:       fmt.Sprintf("%sさんをkickした", name),
		Value:     name,
		Timestamp: time.Now().UnixNano(),
	}

}

// Help ...
func (h KickHandler) Help() string {
	return "ブラックリスト入りします"
}
