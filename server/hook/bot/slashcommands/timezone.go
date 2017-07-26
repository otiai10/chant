package slashcommands

import (
	"time"

	"github.com/otiai10/chant/server/middleware"
	"github.com/otiai10/chant/server/models"
)

// Timezone ...
type Timezone struct{}

// Handle ...
func (cmd Timezone) Handle(req *SlashCommandRequest) error {
	ctx := middleware.Context(req.Request)
	bot := models.Bot()
	members, err := models.Members(ctx)
	if err != nil {
		return models.NewMessage(err.Error(), bot).Push(ctx)
	}
	dict := map[string]interface{}{}
	for _, user := range members {
		if user.Timezone == nil {
			continue
		}
		loc, err := time.LoadLocation(user.Timezone.Name)
		if err != nil {
			return models.NewMessage(err.Error(), bot).Push(ctx)
		}
		dict[user.Name] = map[string]interface{}{
			"date": time.Now().In(loc).Format("15:04 Jan/02"),
			"zone": user.Timezone.Name,
		}
	}
	message := models.NewMessage("timezone", bot)
	message.Type = "TIMEZONE"
	message.Params = dict
	return message.Push(ctx)
}

// Help ...
func (cmd Timezone) Help() string {
	return `/tz
-- Show Timezone!`
}
