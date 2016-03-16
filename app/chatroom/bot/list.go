package bot

import (
	"chant/app/models"
	"container/list"
	"fmt"

	c "chant/conf"
)

// ListHandler ...
type ListHandler struct {
	HandlerBase
}

// Handle ...
func (h ListHandler) Handle(event *models.Event, b *models.User, _ *list.List) *models.Event {

	wait()

	whitelist := c.Whitelist()
	blacklist := c.Blacklist()
	allow := c.AllowDefault()
	return models.NewMessage(b, fmt.Sprintf(
		"whitelist: %v\nblacklist: %v\nallow_default: %v\n", whitelist, blacklist, allow,
	))
}

// Help ...
func (h ListHandler) Help() string {
	return "ホワイトリスト・ブラックリストを確認するやつ"
}
