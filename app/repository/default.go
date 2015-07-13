package repository

import (
	"container/list"

	"chant/app/models"
)

const (
	defaultMessageArchiveSize = 60
	defaultStampArchiveSize   = 20
)

// DefaultRepository コードのスタックを使ったやつ.
type DefaultRepository struct {
	Namespace map[string]*roomRepository
}

type roomRepository struct {
	messages           *list.List
	MessageArchiveSize int
	stamps             *list.List
	StampArchiveSize   int
}

func newRoomRepository() *roomRepository {
	return &roomRepository{
		messages:           list.New(),
		MessageArchiveSize: defaultMessageArchiveSize,
		stamps:             list.New(),
		StampArchiveSize:   defaultStampArchiveSize,
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
		r.messages.PushBack(ev)
	}
	for r.MessageArchiveSize < r.messages.Len() {
		r.messages.Remove(r.messages.Front())
	}
	return nil
}

// GetMessages ...
func (repo *DefaultRepository) getMessages(ns string, count int, than int64) []*models.Event {
	r := repo.getRoomRepository(ns)
	res := []*models.Event{}
	if r.messages.Len() == 0 {
		return res
	}
	for el := r.messages.Back(); el != nil; el = el.Prev() {
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

// GetAllStamps ...
func (repo *DefaultRepository) getAllStamps(ns string) []*models.Event {
	res := []*models.Event{}
	r := repo.getRoomRepository(ns)
	for e := r.stamps.Front(); e != nil; e = e.Next() {
		if ev, ok := e.Value.(*models.Event); ok {
			res = append([]*models.Event{ev}, res...)
		}
	}
	return res
}

func (repo *DefaultRepository) pushStamp(ns string, ev *models.Event) error {
	r := repo.getRoomRepository(ns)
	var used *models.Event
	// LRU
	for e := r.stamps.Back(); e != nil; e = e.Prev() {
		old := e.Value.(*models.Event)
		if ev.StamplyEqual(old) {
			used = old
			r.stamps.Remove(e)
		}
	}
	if used == nil {
		r.stamps.PushBack(ev)
	} else {
		r.stamps.PushBack(used)
	}
	// truncate
	for r.stamps.Len() > r.StampArchiveSize {
		r.stamps.Remove(r.stamps.Front())
	}
	return nil
}
