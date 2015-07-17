package controllers

import (
	"regexp"

	"chant/app/models"

	"github.com/revel/revel"
)

var mobile = regexp.MustCompile("/Mobile|iPhone|Android|BlackBerry/")

// Application ...
type Application struct {
	*revel.Controller
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
			Server: map[string]interface{}{
				"host": getHost(),
			},
			Agent: map[string]interface{}{
				"is_mobile": mobile.MatchString(c.Request.UserAgent()),
			},
			Emojis: emojis,
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

// Logout handles `GET /logout`
func (c Application) Logout() revel.Result {
	c.Session = revel.Session{}
	return c.Redirect("/login")
}

// ServerConfig サーバサイドで取得したエニシングを
// クライアントに埋め込みたいときにつかうサムシング.
type ServerConfig struct {
	Myself interface{} `json:"myself"`
	Server interface{} `json:"server"`
	Agent  interface{} `json:"agent"`
	Emojis interface{} `json:"emojis"`
}

func getHost() string {
	host, _ := revel.Config.String("http.host")
	port, _ := revel.Config.String("http.port")
	if port != "" {
		port = ":" + port
	}
	return host + port
}
