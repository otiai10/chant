package repository

import (
	"container/list"

	"chant.v1/app/models"
)

// DefaultRepository コードのスタックを使ったやつ.
type DefaultRepository struct {
	all *list.List
}

// NewDefaultRepository ...
func NewDefaultRepository() *DefaultRepository {
	return &DefaultRepository{
		all: list.New(),
	}
}

// PushMessage ...
func (repo *DefaultRepository) PushMessage(evs ...*models.Event) error {
	for _, ev := range evs {
		repo.all.PushBack(ev)
	}
	return nil
}

// GetMessages ...
func (repo *DefaultRepository) GetMessages(count int, than int64) []*models.Event {
	res := []*models.Event{}
	if repo.all.Len() == 0 {
		return res
	}
	for el := repo.all.Back(); el != nil; el = el.Prev() {
		ev, ok := el.Value.(*models.Event)
		if ok {
			if than < 0 || ev.Timestamp < than {
				res = append([]*models.Event{el.Value.(*models.Event)}, res...)
			}
		}
		if len(res) >= count {
			return res
		}
	}
	return res
}
