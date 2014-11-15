package controllers

import (
	"github.com/revel/revel"
)

// Room ...
type Room struct {
	*revel.Controller
}

// Index ...
func (c Room) Index() revel.Result {
	user, ok := c.Session["screenName"]
	if !ok {
		return c.Redirect(Application.Index)
		//return c.RenderTemplate("Application/Index.html")
	}
	return c.Render(user)
}

// Leave ...
func (c Room) Leave() revel.Result {
	// TODO: このへんもレポジトリ的な
	delete(c.Session, "name")
	delete(c.Session, "screenName")
	delete(c.Session, "profileImageUrl")
	return c.Redirect(Application.Index)
}
