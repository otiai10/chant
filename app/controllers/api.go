package controllers

import (
	"chant.v1/app/chatroom"
	"github.com/revel/revel"
)

// APIv1 ...
type APIv1 struct {
	*revel.Controller
}

// RoomStamps とりあえず
func (c APIv1) RoomStamps(id string) revel.Result {
	if !chatroom.Exists(id) {
		return c.RenderJson(map[string]interface{}{
			"stamps": []interface{}{},
		})
	}
	room := chatroom.GetRoom(id)
	stamps := room.Repo.GetAllStamps()
	return c.RenderJson(map[string]interface{}{
		"stamps": stamps,
	})
}
