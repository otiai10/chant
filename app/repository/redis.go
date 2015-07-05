package repository

import (
	"strings"

	"chant.v1/app/models"
	"github.com/otiai10/rodeo"
)

var (
	rediskey = "chant"
)

// RedisRepository Redisつかったやつ.
type RedisRepository struct {
	Host    string
	Port    string
	Prefix  string
	vaquero *rodeo.Vaquero
	rooms   map[string]*roomRedis
}

type roomRedis struct {
	messages *rodeo.SortedSet
}

func (repo *RedisRepository) getRoom(ns string) *roomRedis {
	var err error
	if repo.vaquero == nil {
		repo.vaquero, err = rodeo.NewVaquero(repo.Host, repo.Port)
		if err != nil {
			panic(err)
		}
	}
	r, ok := repo.rooms[ns]
	if !ok {
		tamed, err := repo.vaquero.Tame(repo.key(ns, "messages"), models.Event{})
		if err != nil {
			panic(err)
		}
		r = &roomRedis{
			messages: tamed,
		}
	}
	return r
}

// PushMessage ...
func (repo *RedisRepository) pushMessage(ns string, evs ...*models.Event) error {
	for _, ev := range evs {
		repo.getRoom(ns).messages.Add(ev.Timestamp/1000000, ev)
	}
	return nil
}

// GetMessages ...
func (repo *RedisRepository) getMessages(ns string, count int, from int64) []*models.Event {
	events := []*models.Event{}
	for _, val := range repo.getRoom(ns).messages.Range(0) {
		events = append(events, val.Retrieve().(*models.Event))
	}
	return events
}

func (repo *RedisRepository) key(ns, key string) string {
	if repo.Prefix != "" {
		return repo.Prefix + key
	}
	return strings.Join([]string{rediskey, ns, key}, ".")
}

func (repo *RedisRepository) getAllStamps(ns string) []*models.Event {
	events := []*models.Event{}
	return events
}

func (repo *RedisRepository) pushStamp(ns string, ev *models.Event) error {
	return nil
}
