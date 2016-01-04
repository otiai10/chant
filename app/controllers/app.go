package controllers

import (
	"regexp"
	"strconv"
	"time"

	"chant/app/chatroom"
	"chant/app/models"
	"chant/conf"

	"github.com/revel/revel"
)

var (
	mobile    = regexp.MustCompile("/Mobile|iPhone|Android|BlackBerry/")
	timestamp = time.Now().Unix()
)

// Application ...
type Application struct {
	*revel.Controller
}

// Index handles `GET /`
// 1) すでにログインしてたらApp/Indexをレンダリングする.
// 2) ログインしていない場合、App/Loginにリダイレクトする.
func (c Application) Index(roomID, password string) revel.Result {
	if _, ok := c.Session["screen_name"]; ok {

		if reload, _ := strconv.ParseBool(c.Params.Get("reload_conf")); reload {
			conf.Reload()
		}
		if !allowed(c.Session["screen_name"]) {
			return c.Forbidden("denied")
		}

		user, err := models.RestoreUserFromJSON(c.Session["user_raw"])
		if err != nil {
			// とりあえず
			return c.Redirect("/login")
		}

		if len(roomID) == 0 {
			roomID = "default"
		}
		room := chatroom.GetRoomByPassword(roomID, password)

		Config := ServerConfig{
			Myself: user,
			Server: map[string]interface{}{
				"host": getHost(),
			},
			Agent: map[string]interface{}{
				"is_mobile": mobile.MatchString(c.Request.UserAgent()),
			},
			Emojis: emojis,
			Room: map[string]interface{}{
				"name":  room.Name,
				"token": room.Token,
			},
			APIs: map[string]interface{}{
				"googlemaps": revel.Config.StringDefault("googlemaps.token", ""),
			},
		}
		return c.Render(Config, timestamp)
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
	Room   interface{} `json:"room"`
	APIs   interface{} `json:"apis"`
}

func getHost() string {
	host, _ := revel.Config.String("http.host")
	port, _ := revel.Config.String("http.port")
	if port != "" {
		port = ":" + port
	}
	return host + port
}

// とりあえず
func allowed(name string) bool {
	if conf.Blacklist(name) {
		return false
	}
	if conf.Whitelist(name) {
		return true
	}
	return conf.AllowDefault()
}
