package slashcommands

import (
	"net/http"

	"github.com/otiai10/chant/server/models"
)

// SlashCommandRequest ...
type SlashCommandRequest struct {
	Text    string        `json:"text"`
	Sender  *models.User  `json:"sender"`
	Command string        `json:"command"`
	Request *http.Request `json:"-"`
}

// SlashCommand ...
type SlashCommand interface {
	Handle(req *SlashCommandRequest) error
	Help() string
}

// For commands
func For(c string) SlashCommand {
	if cmd, ok := Commands[c]; ok {
		return cmd
	}
	return NotFound{}
}
