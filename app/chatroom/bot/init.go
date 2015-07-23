package bot

import (
	"chant/app/models"
	"math/rand"
	"regexp"
	"time"
)

// DefaultBot ...
func DefaultBot() *models.User {
	return &models.User{
		IDstr:           "unknown",
		Name:            "秘書たん",
		ScreenName:      "hisyotan",
		ProfileImageURL: "/public/img/hisyotan.png",
	}
}

// Handler ...
type Handler interface {
	Match(*models.Event) bool
	Handle(*models.Event, *models.User) *models.Event
}

// Handlers ...
var Handlers = map[string]Handler{}

func init() {
	Handlers = map[string]Handler{
		"icon":  IconHandler{regexp.MustCompile("^/icon[ 　]+")},
		"oppai": OppaiHandler{regexp.MustCompile("^/oppai")},
		"image": ImageHandler{regexp.MustCompile("^/image[ 　]+")},
		"amesh": AmeshHandler{regexp.MustCompile("^/amesh")},
		"hello": HelloHandler{regexp.MustCompile("^/hello")},
	}
}

// httpなど介さないHandlerはレスポンスが早すぎるので
// 0~3秒の遅延を意図的につくる
func wait() {
	rand.Seed(time.Now().Unix())
	time.Sleep(time.Duration(rand.Intn(time.Now().Second())*50) * time.Millisecond)
}
