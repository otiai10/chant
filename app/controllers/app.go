package controllers

import (
	"chant/app/factory"
	"github.com/revel/revel"
	"regexp"
)

type Application struct {
	*revel.Controller
}

type Env struct {
	IsMobile bool
}

// さいしょのページレンダリングだけー
func (c Application) Index() revel.Result {
	if _, ok := c.Session["screenName"]; ok {
		user, _ := factory.UserFronSession(c.Session)
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

func init() {
	// revel.Controller.*が実行されるときに必ず呼べる？
	// TWITTER.Debug(true)
}
