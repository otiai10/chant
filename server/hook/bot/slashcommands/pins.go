package slashcommands

import (
	"fmt"
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
	middleware.Log(ctx).Debugf("%+v\n", dict)
	pins := []*models.Pin{}
	for id, pin := range dict {
		pin.ID = id
		pins = append(pins, pin)
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
	return `/pins
-- Show/Delete pinned entries`
}
