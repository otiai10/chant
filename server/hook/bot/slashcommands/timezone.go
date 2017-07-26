package slashcommands

import (
	"fmt"
	"strings"
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
	list := []string{}
	for _, user := range members {
		if user.Timezone == nil {
			continue
		}
		loc, err := time.LoadLocation(user.Timezone.Name)
		if err != nil {
			return models.NewMessage(err.Error(), bot).Push(ctx)
		}
		expression := time.Now().In(loc).Format("15:04")
		list = append(list, fmt.Sprintf("%s:  %s (%s)", user.Name, expression, user.Timezone.Name))
	}
	message := models.NewMessage(strings.Join(list, "\n"), bot)
	return message.Push(ctx)
}

// Help ...
func (cmd Timezone) Help() string {
	return `/tz
-- Show Timezone!`
}
