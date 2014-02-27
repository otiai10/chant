package controllers

import (
	"chant/app/factory"
	"github.com/robfig/revel"
)

type Application struct {
	*revel.Controller
}

// さいしょのページレンダリングだけー
func (c Application) Index() revel.Result {
	if _, ok := c.Session["screenName"]; ok {
		user, _ := factory.UserFronSession(c.Session)
		server := factory.ServerFromConf(revel.Config)
		return c.Render(user, server)
		//return c.Redirect(Room.Index)
	}
	return c.RenderTemplate("Top/Index.html")
}

func init() {
	// revel.Controller.*が実行されるときに必ず呼べる？
	// TWITTER.Debug(true)
}
