package repository

import (
	"chant.v1/app/models"
	"github.com/otiai10/rodeo"
)

var (
	rediskey = "chant."
)

// RedisRepository Redisつかったやつ.
type RedisRepository struct {
	Host     string
	Port     string
	Prefix   string
	vaquero  *rodeo.Vaquero
	messages *rodeo.SortedSet
}

// PushMessage ...
func (repo *RedisRepository) PushMessage(evs ...*models.Event) error {
	repo.ensure()
	for _, ev := range evs {
		repo.messages.Add(ev.Timestamp/1000000, ev)
	}
	return nil
}

// GetMessages ...
func (repo *RedisRepository) GetMessages(count int, from int64) []*models.Event {
	repo.ensure()
	events := []*models.Event{}
	for _, val := range repo.messages.Range(0) {
		events = append(events, val.Retrieve().(*models.Event))
	}
	return events
}

func (repo *RedisRepository) key(key string) string {
	if repo.Prefix != "" {
		return repo.Prefix + key
	}
	return rediskey + key
}

func (repo *RedisRepository) ensure() {
	if repo.vaquero == nil {
		var err error
		repo.vaquero, err = rodeo.NewVaquero(repo.Host, repo.Port)
		if err != nil {
			panic(err)
		}
		repo.messages, err = repo.vaquero.Tame(repo.key("messages"), models.Event{})
		if err != nil {
			panic(err)
		}
	}
}
