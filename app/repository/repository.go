package repository

import (
	"fmt"

	"chant.v1/app/models"
)

// Repository オンメモリとか、Redisとか.
type Repository interface {
	PushMessage(*models.Event) error
	GetMessages(int, int64) []*models.Event
}

var (
	_impl Repository
)

// InitWithInstance ...
func InitWithInstance(repo Repository) error {
	if _impl != nil {
		return fmt.Errorf("repository is already initialized")
	}
	_impl = repo
	return nil
}

// PushMessage ...
func PushMessage(ev *models.Event) error {
	if _impl == nil {
		return fmt.Errorf("init repository first")
	}
	return _impl.PushMessage(ev)
}

// GetMessages ...
func GetMessages(count int, from int64) []*models.Event {
	return _impl.GetMessages(count, from)
}
