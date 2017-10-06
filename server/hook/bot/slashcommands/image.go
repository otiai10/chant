package slashcommands

import (
	"fmt"
	"strings"

	"github.com/otiai10/chant/server/middleware"
	"github.com/otiai10/chant/server/middleware/lib/google"
	"github.com/otiai10/chant/server/models"
)

// Img executes image search with Google.
type Img struct {
	history map[string]int
	clear   bool
	verbose bool
}

// Handle ...
func (cmd *Img) Handle(req *SlashCommandRequest) error {
	ctx := middleware.Context(req.Request)
	bot := models.Bot()
	client, err := google.NewClient(ctx)
	if err != nil {
		message := models.NewMessage(err.Error(), bot)
		return message.Push(ctx)
	}
	cmd.parseOptions(req)
	offset := cmd.getOffset(req)
	res, err := client.SearchImage(req.Text, offset+1)
	if err != nil {
		message := models.NewMessage(err.Error(), bot)
		return message.Push(ctx)
	}
	if len(res.Items) == 0 {
		message := models.NewMessage(fmt.Sprintf("Item not found for query `%s`", req.Text), bot)
		return message.Push(ctx)
	}
	text := res.RandomItem().Link
	if cmd.verbose {
		text = fmt.Sprintf("query: %s\noffset: %d\nmatch: %d\nclear: %t\n%s", req.Text, offset, len(res.Items), cmd.clear, text)
	}

	cmd.incrementHistory(req)

	message := models.NewMessage(text, bot)
	return message.Push(ctx)
}

func (cmd *Img) parseOptions(req *SlashCommandRequest) {
	pool := []string{}
	cmd.verbose = false
	cmd.clear = false
	for _, word := range strings.Split(req.Text, " ") {
		switch word {
		case "-v":
			cmd.verbose = true
		case "-c":
			cmd.clear = true
		case "/img", "/image":
			// do nothing
		default:
			pool = append(pool, word)
		}
	}
	req.Text = strings.Join(pool, " ")
}

func (cmd *Img) getOffset(req *SlashCommandRequest) int {
	if cmd.clear {
		cmd.history = map[string]int{}
	}
	return cmd.history[req.Text] - cmd.history[req.Text]%5
}

func (cmd *Img) incrementHistory(req *SlashCommandRequest) {
	if cmd.history[req.Text] == 0 {
		// Flush all other histories
		cmd.history = map[string]int{}
	}
	cmd.history[req.Text] = cmd.history[req.Text] + 1
}

// Help ...
func (cmd *Img) Help() string {
	return `/img {query}
-- Search images with Google`
}
