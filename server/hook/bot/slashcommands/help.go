package slashcommands

import (
	"strings"

	"github.com/otiai10/chant/server/middleware"
	"github.com/otiai10/chant/server/models"
)

// Help ...
type Help struct {
}

// Handle ...
func (cmd Help) Handle(req *SlashCommandRequest) error {
	ctx := middleware.Context(req.Request)
	bot := models.Bot()
	helps := []string{}
	for _, cmd := range Commands {
		helps = append(helps, cmd.Help())
	}
	text := strings.Join(helps, "\n")
	message := models.NewMessage(text, bot)
	return message.Push(ctx)
}

// Help ...
func (cmd Help) Help() string {
	return `/help
-- Help!`
}
