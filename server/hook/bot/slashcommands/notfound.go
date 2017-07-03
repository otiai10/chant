package slashcommands

// NotFound ...
type NotFound struct{}

// Handle ...
func (cmd NotFound) Handle(req *SlashCommandRequest) error {
	return nil
}

// Help ...
func (cmd NotFound) Help() string {
	return ""
}
