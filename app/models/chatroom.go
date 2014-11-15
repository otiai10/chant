package models

// Event ...
type Event struct {
	Type      string // "join", "leave", or "message"
	User      *User
	Timestamp int    // Unix timestamp (secs)
	Text      string // What the user said (if Type == "message")
	RoomInfo  *Info
}

// Subscription ...
type Subscription struct {
	Archive []Event // All the events from the archive.
	//SoundArchive []Sound
	New <-chan Event // New events coming in.
}

// Info ...
type Info struct {
	Users   map[string]*User
	Updated bool
}
