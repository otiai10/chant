package controllers

import (
	"github.com/revel/revel"
	"chant.v1/app/models"
)

// Application ...
type Application struct {
	*revel.Controller
}

// Env ...
type Env struct {
	IsMobile bool
}

// Index handles `GET /`
// 1) すでにログインしてたらApp/Indexをレンダリングする.
// 2) ログインしていない場合、App/Loginにリダイレクトする.
func (c Application) Index() revel.Result {
	if _, ok := c.Session["screen_name"]; ok {
		user, err := models.RestoreUserFromJSON(c.Session["user_raw"])
		if err != nil {
			// とりあえず
			return c.Redirect("/login")
		}
		Config := ServerConfig{
			Myself: user,
		}
		return c.Render(Config)
		//return c.Redirect(Room.Index)
	}
	return c.Redirect("/login")
}

// Login handles `GET /login`
// Twitterログイン用の入り口Viewをレンダリングするだけ.
func (c Application) Login() revel.Result {
	return c.Render()
}

type ServerConfig struct {
	Myself interface{} `json:"myself"`
}
