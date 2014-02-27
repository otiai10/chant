package controllers

import (
	//"code.google.com/p/go.net/websocket"
	"github.com/robfig/revel"
	//"github.com/robfig/revel/samples/chat/app/chatroom"

	"fmt"
)

type Room struct {
	*revel.Controller
}

func (c Room) Index() revel.Result {
	user, ok := c.Session["screenName"]
	fmt.Println("入室時セッションチェック", user, ok)
	if !ok {
		return c.Redirect(Application.Index)
		//return c.RenderTemplate("Application/Index.html")
	}
	return c.Render(user)
}
func (c Room) Leave() revel.Result {
	// TODO: このへんもレポジトリ的な
	delete(c.Session, "name")
	delete(c.Session, "screenName")
	delete(c.Session, "profileImageUrl")
	user, ok := c.Session["screenName"]
	fmt.Println("退室時セッションチェック", user, ok)
	return c.Redirect(Application.Index)
}
