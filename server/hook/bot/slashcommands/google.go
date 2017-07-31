package slashcommands

import (
	"fmt"
	"net/url"
	"strings"

	"github.com/otiai10/chant/server/middleware"
	"github.com/otiai10/chant/server/middleware/lib/google"
	"github.com/otiai10/chant/server/models"
)

// Google executes google keyword search with Google.
type Google struct{}

// Handle ...
func (cmd Google) Handle(req *SlashCommandRequest) error {
	ctx := middleware.Context(req.Request)
	bot := models.Bot()
	client, err := google.NewClient(ctx)
	if err != nil {
		message := models.NewMessage(err.Error(), bot)
		return message.Push(ctx)
	}
	keyword := strings.Trim(strings.Replace(req.Text, req.Command, "", 1), " 　")
	query := url.Values{}
	query.Add("q", keyword)
	res, err := client.CustomSearch(query)
	if err != nil {
		message := models.NewMessage(err.Error(), bot)
		return message.Push(ctx)
	}
	if len(res.Items) == 0 {
		message := models.NewMessage(fmt.Sprintf("Item not found for keyword `%s`", keyword), bot)
		return message.Push(ctx)
	}
	links := []string{}
	for i, item := range res.Items[:3] {
		links = append(links, fmt.Sprintf("[%d]", i), item.Link)
	}
	message := models.NewMessage(strings.Join(links, "\n\n"), bot)
	return message.Push(ctx)
}

// Help ...
func (cmd Google) Help() string {
	return `/ggl {query}
-- Search keyword with Google`
}
