package models

import "container/list"

// Info ...
type Info struct {
	Users    map[string]*User
	Updated  bool
	AllUsers *list.List
}
