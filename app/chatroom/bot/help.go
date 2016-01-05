package bot

import (
	"chant/app/models"
	"fmt"
	"reflect"
)

// HelpHandler ...
type HelpHandler struct {
	HandlerBase
}

// Handle ...
func (h HelpHandler) Handle(event *models.Event, b *models.User) *models.Event {
	wait()
	msg := ""
	for key, handler := range Handlers {
		msg += fmt.Sprintf("/%s:　　%s.Help()がここに入る\n", key, reflect.TypeOf(handler).String())
	}
	return models.NewMessage(b, msg)
}
