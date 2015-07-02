package repository

import (
	"chant.v1/app/models"
)

// DefaultRepository コードのスタックを使ったやつ.
type DefaultRepository struct {
	messages []*models.Event
}

// PushMessage ...
func (repo *DefaultRepository) PushMessage(ev *models.Event) error {
	repo.messages = append(repo.messages, ev)
	return nil
}

// GetMessages ...
func (repo *DefaultRepository) GetMessages(count int, from int64) []*models.Event {
	return repo.messages
}
