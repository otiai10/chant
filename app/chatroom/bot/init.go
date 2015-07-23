package bot

import (
	"chant/app/lib/message"
	"chant/app/models"
	"math/rand"
	"path/filepath"
	"regexp"
	"time"

	"github.com/otiai10/curr"
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

var (
	// Handlers ...
	Handlers = map[string]Handler{}
	// Messages ...
	Messages message.Messages
)

func init() {
	Handlers = map[string]Handler{
		"icon":   IconHandler{regexp.MustCompile("^/icon[ 　]+")},
		"oppai":  OppaiHandler{regexp.MustCompile("^/oppai")},
		"image":  ImageHandler{regexp.MustCompile("^/image[ 　]+")},
		"amesh":  AmeshHandler{regexp.MustCompile("^/amesh")},
		"hello":  HelloHandler{regexp.MustCompile("^/hello")},
		"whoami": WhoamiHandler{regexp.MustCompile("^/whoami")},
	}

	m, err := message.LoadDir(filepath.Join(curr.Dir(), "messages"))
	if err != nil {
		panic(err)
	}
	Messages = m
}

// httpなど介さないHandlerはレスポンスが早すぎるので
// 0~3秒の遅延を意図的につくる
func wait() {
	rand.Seed(time.Now().Unix())
	time.Sleep(time.Duration(rand.Intn(time.Now().Second()+1)*50) * time.Millisecond)
}
