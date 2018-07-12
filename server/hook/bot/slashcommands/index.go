package slashcommands

// Commands registry
var Commands = map[string]SlashCommand{
	"/amesh":  Amesh{},
	"/img":    new(Img),
	"/gif":    Gif{},
	"/ggl":    Google{},
	"/hello":  Hello{},
	"/help":   Help{},
	"/tz":     Timezone{},
	"/pins":   Pins{},
	"/pin":    Pins{},
	"/reload": Reload{},
}
