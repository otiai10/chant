package controllers

import "github.com/revel/revel"

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
		return c.Render()
		//return c.Redirect(Room.Index)
	}
	return c.Redirect("/login")
}

// Login handles `GET /login`
// Twitterログイン用の入り口Viewをレンダリングするだけ.
func (c Application) Login() revel.Result {
	return c.Render()
}
