package slashcommands

// Commands registry
var Commands = map[string]SlashCommand{
	"/amesh": Amesh{},
	"/hello": Hello{},
	"/help":  Help{},
}
