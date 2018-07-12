package slashcommands

import (
	"fmt"
	"time"

	"github.com/otiai10/chant/server/middleware"
	"github.com/otiai10/chant/server/models"
)

// Reload ...
type Reload struct{}

// Handle ...
func (r Reload) Handle(req *SlashCommandRequest) error {
	ctx := middleware.Context(req.Request)
	bot := models.Bot()
	message := &models.Message{
		Time: time.Now().UnixNano() / (1000 * 1000),
		Text: fmt.Sprintf(
			"%v requested reloading your JavaScript.",
			req.Sender.Name,
		),
		Type: "RELOAD",
		Params: map[string]interface{}{
			"client-timestamp": req.Request.Header.Get("X-Chant-Client-Timestamp"),
		},
		User: bot,
	}
	return message.Push(ctx)
}

// Help ...
func (r Reload) Help() string {
	return `/reload
-- Ask users to reload local JavaScript`
}
