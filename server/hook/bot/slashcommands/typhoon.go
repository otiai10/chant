package slashcommands

import (
	"time"

	"github.com/otiai10/amesh/plugins/typhoon"
	"github.com/otiai10/chant/server/middleware"
	"github.com/otiai10/chant/server/models"
)

// Typhoon ...
type Typhoon struct{}

// Handle ...
func (cmd Typhoon) Handle(req *SlashCommandRequest) error {
	bot := models.Bot()
	ctx := middleware.Context(req.Request)
	client := middleware.HTTPClient(ctx)
	entry, err := typhoon.GetEntry(client)
	if err != nil {
		message := models.NewMessage(err.Error(), bot)
		return message.Push(ctx)
	}
	message := &models.Message{
		Time: time.Now().UnixNano() / (1000 * 1000),
		Text: entry.NearJP,
		Type: "TYPHOON",
		User: bot,
	}
	return message.Push(ctx)
}

// Help ...
func (cmd Typhoon) Help() string {
	return `/typhoon
-- Show information of upcoming typhoon near Japan`
}
