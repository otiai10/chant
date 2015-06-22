package repository

import (
	"fmt"

	"chant.v1/app/models"
)

// Repository オンメモリとか、Redisとか.
type Repository interface {
	PushMessage(*models.Event) error
	GetMessages(int64) []*models.Event
}

var (
	_impl Repository
)

func InitWithInstance(repo Repository) error {
	if _impl != nil {
		return fmt.Errorf("repository is already initialized")
	}
	_impl = repo
	return nil
}

func PushMessage(ev *models.Event) error {
	if _impl == nil {
		return fmt.Errorf("init repository first!!")
	}
	return _impl.PushMessage(ev)
}

func GetMessages(from int64) []*models.Event {
	return _impl.GetMessages(from)
}
