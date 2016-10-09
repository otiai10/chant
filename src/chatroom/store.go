package chatroom

// RoomStore ...
type RoomStore interface {
	GetRoom(string) *Room
	SetRoom(string, *Room)
}

// {{{ TEMPORARY!!

// OnMemoryRoomStore ...
type OnMemoryRoomStore struct {
	registry map[string]*Room
}

// GetRoom ...
func (s OnMemoryRoomStore) GetRoom(name string) *Room {
	_, ok := s.registry[name]
	if !ok {
		s.registry[name] = createRoom(name)
	}
	return s.registry[name]
}

// SetRoom ...
func (s OnMemoryRoomStore) SetRoom(name string, room *Room) {
	s.registry[name] = room
}

// }}}
