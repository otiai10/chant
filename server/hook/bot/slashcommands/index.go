package slashcommands

// Commands registry
var Commands = map[string]SlashCommand{
	"/amesh": Amesh{},
	"/img":   Img{},
	"/gif":   Gif{},
	"/hello": Hello{},
	"/help":  Help{},
	"/tz":    Timezone{},
}
