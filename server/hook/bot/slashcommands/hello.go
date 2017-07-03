package slashcommands

import (
	"github.com/otiai10/chant/server/middleware"
	"github.com/otiai10/chant/server/models"
)

// Hello ...
type Hello struct{}

// Handle ...
func (cmd Hello) Handle(req *SlashCommandRequest) error {
	ctx := middleware.Context(req.Request)
	bot := models.Bot()
	message := models.NewMessage("Hello!", bot)
	return message.Push(ctx)
}

// Help ...
func (cmd Hello) Help() string {
	return `/hello
-- Hello!`
}
