package bot

import (
	"chant/app/models"
	"fmt"
)

// HelpHandler ...
type HelpHandler struct {
	HandlerBase
}

// Handle ...
func (h HelpHandler) Handle(event *models.Event, b *models.User) *models.Event {

	wg := delay()
	defer wg.Wait()

	msg := ""
	for key, h := range Handlers {
		msg += fmt.Sprintf("/%s: %s\n", key, h.Help())
	}
	return models.NewMessage(b, msg)
}

// Help ...
func (h HelpHandler) Help() string {
	return "ヘルプ見るやつ"
}
