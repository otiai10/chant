package repository

import (
	"container/list"

	"chant.v1/app/models"
)

const (
	defaultMessageArchiveSize = 60
)

// DefaultRepository コードのスタックを使ったやつ.
type DefaultRepository struct {
	Namespace map[string]*roomRepository
}

type roomRepository struct {
	all                *list.List
	MessageArchiveSize int
}

func newRoomRepository() *roomRepository {
	return &roomRepository{
		all:                list.New(),
		MessageArchiveSize: defaultMessageArchiveSize,
	}
}
func (repo *DefaultRepository) getRoomRepository(ns string) *roomRepository {
	if len(ns) == 0 {
		return repo.Namespace["default"]
	}
	r, ok := repo.Namespace[ns]
	if !ok {
		r = newRoomRepository()
		repo.Namespace[ns] = r
	}
	return repo.Namespace[ns]
}

// NewDefaultRepository ...
func NewDefaultRepository() *DefaultRepository {
	return &DefaultRepository{
		Namespace: map[string]*roomRepository{
			"default": newRoomRepository(),
		},
	}
}

// PushMessage ...
func (repo *DefaultRepository) pushMessage(ns string, evs ...*models.Event) error {
	r, ok := repo.Namespace[ns]
	if !ok {
		r = newRoomRepository()
		repo.Namespace[ns] = r
	}
	for _, ev := range evs {
		r.all.PushBack(ev)
	}
	for r.MessageArchiveSize < r.all.Len() {
		r.all.Remove(r.all.Front())
	}
	return nil
}

// GetMessages ...
func (repo *DefaultRepository) getMessages(ns string, count int, than int64) []*models.Event {
	r := repo.getRoomRepository(ns)
	res := []*models.Event{}
	if r.all.Len() == 0 {
		return res
	}
	for el := r.all.Back(); el != nil; el = el.Prev() {
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
