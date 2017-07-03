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
	text := strings.Join([]string{
		Hello{}.Help(),
		Help{}.Help(),
	}, "\n")
	message := models.NewMessage(text, bot)
	return message.Push(ctx)
}

// Help ...
func (cmd Help) Help() string {
	return `/help
-- Help!`
}
