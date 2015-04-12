package controllers

import (
	"chant/app/factory"
	"regexp"

	"github.com/revel/revel"
)

// Application ...
type Application struct {
	*revel.Controller
}

// Env ...
type Env struct {
	IsMobile bool
}

// Index さいしょのページレンダリングだけー
func (c Application) Index() revel.Result {
	if _, ok := c.Session["screenName"]; ok {
		user, _ := factory.UserFromSession(c.Session)
		server := factory.ServerFromConf(revel.Config)
		env := c.getEnv()
		return c.Render(user, server, env)
		//return c.Redirect(Room.Index)
	}
	return c.RenderTemplate("Top/Index.html")
}

func (c Application) getEnv() Env {
	return Env{
		IsMobile: c.isMobile(),
	}
}

func (c Application) isMobile() bool {
	// これ以外の取り方ないの？
	var useragent string
	useragents, ok := c.Controller.Request.Request.Header["User-Agent"]
	if ok && len(useragents) > 0 {
		useragent = useragents[0]
	}
	return regexp.MustCompile("Mobile").MatchString(useragent)
}
