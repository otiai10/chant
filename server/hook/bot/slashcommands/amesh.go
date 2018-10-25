package slashcommands

import (
	"time"

	"github.com/otiai10/amesh/lib/amesh"
	"github.com/otiai10/chant/server/middleware"
	"github.com/otiai10/chant/server/models"
)

// Amesh ...
type Amesh struct{}

// Handle ...
func (cmd Amesh) Handle(req *SlashCommandRequest) error {
	ctx := middleware.Context(req.Request)
	entry := amesh.GetEntry()
	bot := models.Bot()
	message := &models.Message{
		Time: time.Now().UnixNano() / (1000 * 1000),
		Text: "amesh",
		Type: "AMESH",
		Params: map[string]interface{}{
			"map":  entry.Map,
			"mask": entry.Mask,
			"mesh": entry.Mesh,
		},
		User: bot,
	}
	return message.Push(ctx)
}

// Help ...
func (cmd Amesh) Help() string {
	return `/amesh
-- Show amesh`
}
