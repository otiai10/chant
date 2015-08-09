package repository

import (
	"strings"

	"chant/app/models"

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

// NewRedisRepository ...
func NewRedisRepository(host, port string, prefix ...string) *RedisRepository {
	prefix = append(prefix, "")
	return &RedisRepository{
		Host:   host,
		Port:   port,
		Prefix: prefix[0],
		rooms:  map[string]*roomRedis{},
	}
}

type roomRedis struct {
	messages *rodeo.SortedSet
	stamps   *rodeo.SortedSet
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
		tamedStamps, err := repo.vaquero.Tame(repo.key(ns, "stamps"), models.Event{})
		if err != nil {
			panic(err)
		}
		r = &roomRedis{
			messages: tamed,
			stamps:   tamedStamps,
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
	for _, val := range repo.getRoom(ns).stamps.Range(0) {
		events = append([]*models.Event{val.Retrieve().(*models.Event)}, events...)
	}
	return events
}

func (repo *RedisRepository) pushStamp(ns string, ev *models.Event) error {
	tamed := repo.getRoom(ns).stamps
	for _, v := range tamed.Range(0) {
		if v.Retrieve().(*models.Event).Raw == ev.Raw {
			// tamed.Remove(v) // <-こっちのがいいはずなんだが...
			err := tamed.Sweep(v.Score(), v.Score())
			if err != nil {
				return err
			}
		}
	}
	tamed.Add(ev.Timestamp/1000000, ev)
	// TODO: cut the tail if overflows the StampArchiveSize
	cnt, err := tamed.Count()
	if err != nil {
		return err
	}
	if cnt > defaultStampArchiveSize {
		vals := tamed.Range(0, cnt-defaultStampArchiveSize)
		if len(vals) == 0 {
			return nil
		}
		return tamed.Sweep(0, vals[len(vals)-1].Score())
	}
	return nil
}
