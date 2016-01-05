package bot

import "chant/app/models"

// OppaiHandler ...
type OppaiHandler struct {
	HandlerBase
}

// Handle ...
func (h OppaiHandler) Handle(event *models.Event, b *models.User) *models.Event {
	wait()
	return models.NewMessage(b, "おっぱいな")
}

// Help ...
func (h OppaiHandler) Help() string {
	return "おっぱいはいいぞ"
}
