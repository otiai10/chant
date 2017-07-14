package slashcommands

import (
	"fmt"
	"strings"

	"github.com/otiai10/chant/server/middleware"
	"github.com/otiai10/chant/server/middleware/lib/google"
	"github.com/otiai10/chant/server/models"
)

// Img executes image search with Google.
type Img struct{}

// Handle ...
func (cmd Img) Handle(req *SlashCommandRequest) error {
	ctx := middleware.Context(req.Request)
	bot := models.Bot()
	client, err := google.NewClient(ctx)
	if err != nil {
		message := models.NewMessage(err.Error(), bot)
		return message.Push(ctx)
	}
	keyword := strings.Trim(strings.Replace(req.Text, req.Command, "", 1), " 　")
	res, err := client.SearchImage(keyword)
	if err != nil {
		message := models.NewMessage(err.Error(), bot)
		return message.Push(ctx)
	}
	if len(res.Items) == 0 {
		message := models.NewMessage(fmt.Sprintf("Item not found for keyword `%s`", keyword), bot)
		return message.Push(ctx)
	}
	item := res.RandomItem()
	message := models.NewMessage(item.Link, bot)
	return message.Push(ctx)
}

// Help ...
func (cmd Img) Help() string {
	return `/img {query}
-- Search images with Google`
}
