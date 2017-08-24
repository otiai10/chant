package slashcommands

import (
	"fmt"
	"strings"
	"time"

	"github.com/otiai10/chant/server/middleware"
	"github.com/otiai10/chant/server/models"
)

// Pins ...
type Pins struct{}

// Handle ...
func (cmd Pins) Handle(req *SlashCommandRequest) error {
	ctx := middleware.Context(req.Request)
	bot := models.Bot()
	dict, err := models.Pins(ctx)
	if err != nil {
		return models.NewMessage(err.Error(), bot).Push(ctx)
	}
	if len(dict) == 0 {
		return models.NewMessage("No any entries pinned", bot).Push(ctx)
	}
	queries := strings.Split(req.Text, " ")[1:]
	pins := []*models.Pin{}
	for id, pin := range dict {
		if pin.HasQueries(queries) {
			pin.ID = id
			pins = append(pins, pin)
		}
	}
	if len(pins) == 0 {
		return models.NewMessage(fmt.Sprintf("No pins found for query: %v", queries), bot).Push(ctx)
	}
	message := &models.Message{
		Time: time.Now().UnixNano() / (1000 * 1000),
		Text: fmt.Sprintf("Pins: %d\n", len(pins)),
		Type: "PIN_LIST",
		Params: map[string]interface{}{
			"pins": pins,
		},
		User: bot,
	}
	return message.Push(ctx)
}

// Help ...
func (cmd Pins) Help() string {
	return `/pins {query}
-- Show/Delete pinned entries`
}
