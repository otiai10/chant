package chatroom

import (
	// XXX: Appengine is under Go 1.6 and doesn't have "context".

	"golang.org/x/net/context"
	"google.golang.org/appengine/datastore"

	"github.com/otiai10/chant/src/models"
)

// TEMP ...
var rooms RoomStore = OnMemoryRoomStore{
	registry: map[string]*Room{},
}

// Room ...
type Room struct {
	Name        string
	Subscribers []string
	Members     []models.User
}

// AddMember ...
func (r *Room) AddMember(user *models.User, subscription string) {
	// r.Members[user.IDString] = user
	r.Members = append(r.Members, *user)
	r.addUniqueSubscription(subscription)
}

func (r *Room) addUniqueSubscription(subscription string) {
	if !r.hasSubscription(subscription) {
		r.Subscribers = append(r.Subscribers, subscription)
	}
}

func (r *Room) hasSubscription(subscription string) bool {
	for _, sub := range r.Subscribers {
		if sub == subscription {
			return true
		}
	}
	return false
}

// Save ...
func (r *Room) Save(ctx context.Context) error {
	key := datastore.NewKey(ctx, "Room", r.Name, 0, nil)
	_, err := datastore.Put(ctx, key, r)
	return err
}

// createRoom ...
func createRoom(name string) *Room {
	return &Room{
		Name:        name,
		Subscribers: []string{},
		Members:     []models.User{},
	}
}

// GetRoom ...
func GetRoom(ctx context.Context, name string) (*Room, error) {
	room := &Room{}
	key := datastore.NewKey(ctx, "Room", name, 0, nil)
	err := datastore.Get(ctx, key, room)
	if err == datastore.ErrNoSuchEntity {
		return createRoom(name), nil
	}
	/*
		room := rooms.GetRoom(name)
		if room == nil {
			rooms.SetRoom(name, createRoom(name))
		}
		return rooms.GetRoom(name)
	*/
	return room, err
}
