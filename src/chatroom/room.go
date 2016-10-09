package chatroom

import "github.com/otiai10/chant/src/models"

// TEMP ...
var rooms RoomStore = OnMemoryRoomStore{
	registry: map[string]*Room{},
}

// Room ...
type Room struct {
	Name        string
	Subscribers []string
	Members     map[string]models.User
}

// AddSubscriber ...
func (r *Room) AddSubscriber(channeltoken string) {
	r.Subscribers = append(r.Subscribers, channeltoken)
}

// createRoom ...
func createRoom(name string) *Room {
	return &Room{
		Name:        name,
		Subscribers: []string{},
		Members:     map[string]models.User{},
	}
}

// GetRoom ...
func GetRoom(name string) *Room {
	room := rooms.GetRoom(name)
	if room == nil {
		rooms.SetRoom(name, createRoom(name))
	}
	return rooms.GetRoom(name)
}
