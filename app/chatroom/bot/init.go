package bot

import (
	"chant/app/lib/message"
	"chant/app/models"
	"math/rand"
	"path/filepath"
	"regexp"
	"time"

	"github.com/BurntSushi/toml"
	"github.com/otiai10/amesh"
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
	Help() string
}

// HandlerBase ...
type HandlerBase struct {
	*regexp.Regexp
}

// Match ...
func (h HandlerBase) Match(event *models.Event) bool {
	return h.MatchString(event.Raw)
}

// Help ...
func (h HandlerBase) Help() string {
	return h.String()
}

type conf struct {
	SoundCloud struct {
		ClientID string `toml:"client_id"`
	} `toml:"soundcloud"`
	Google struct {
		DefaultCseID string `toml:"default_cse_id"`
		APIKey       string `toml:"api_key"`
	} `toml:"google"`
}

var config conf

// Vars
var (
	Handlers      = map[string]Handler{}
	Messages      message.Messages
	AmeshObserver *amesh.Observer
)

func init() {
	Handlers = map[string]Handler{
		"icon":       IconHandler{HandlerBase{regex("^/icon[ 　]+")}},
		"oppai":      OppaiHandler{HandlerBase{regex("^/oppai")}},
		"image":      ImageHandler{HandlerBase{regex("^/ima?ge?[ 　]+")}},
		"gif":        GifHandler{HandlerBase{regex("^/gif[ 　]+")}},
		"ggl":        GoogleHandler{HandlerBase{regex("^/ggl[ 　]+")}},
		"map":        MapHandler{HandlerBase{regex("^/map[ 　]+")}},
		"vine":       VineHandler{HandlerBase{regex("^/vine[ 　]+")}},
		"youtube":    YoutubeHandler{HandlerBase{regex("^/yt|youtube[ 　]+")}},
		"amesh":      AmeshHandler{HandlerBase{regex("^/amesh[ 　]*")}},
		"hello":      HelloHandler{HandlerBase{regex("^/hello")}},
		"whoami":     WhoamiHandler{HandlerBase{regex("^/whoami")}},
		"help":       HelpHandler{HandlerBase{regex("^/help")}},
		"soundcloud": SoundCloudHandler{HandlerBase{regex("^/sc")}},
		"kick":       KickHandler{HandlerBase{regex("^/kick[ 　]+")}},
		"invite":     InviteHandler{HandlerBase{regex("^/invite[ 　]+")}},
		"list":       ListHandler{HandlerBase{regex("^/list")}},
	}
	// bot config
	if _, err := toml.DecodeFile(filepath.Join(curr.Dir(), "/config.toml"), &config); err != nil {
		panic(err)
	}

	// messages
	m, err := message.LoadDir(filepath.Join(curr.Dir(), "messages"))
	if err != nil {
		panic(err)
	}
	Messages = m

	AmeshObserver = amesh.NewObserver(5 * time.Minute)
	AmeshObserver.On(amesh.Update, func(ev amesh.Event) error { return nil })
	AmeshObserver.On(amesh.Start, func(ev amesh.Event) error { return nil })
	AmeshObserver.On(amesh.Stop, func(ev amesh.Event) error { return nil })
}

// httpなど介さないHandlerはレスポンスが早すぎるので
// 0~3秒の遅延を意図的につくる
func wait() {
	rand.Seed(time.Now().Unix())
	time.Sleep(time.Duration(rand.Intn(time.Now().Second()+1)*50) * time.Millisecond)
}

// ただのregexp.MustCompileのalias
func regex(pattern string) *regexp.Regexp {
	return regexp.MustCompile(pattern)
}
