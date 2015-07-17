package controllers

import (
	"path"
	"path/filepath"
	"strings"

	"github.com/mrjones/oauth"
	"github.com/otiai10/curr"
	"github.com/revel/revel"
)

// コンシューマの定義とプロバイダの定義を含んだ
// *oauth.Consumerをつくる
var (
	twitter *oauth.Consumer
	emojis  = map[string]string{}
)

func init() {
	loadEmojis()
}

// Twitter ...
func Twitter() *oauth.Consumer {
	if twitter == nil {
		key, _ := revel.Config.String("twitter.key")
		secret, _ := revel.Config.String("twitter.secret")
		twitter = oauth.NewConsumer(
			// コンシューマの定義
			key,
			secret,
			// プロバイダの定義
			oauth.ServiceProvider{
				AuthorizeTokenUrl: "https://api.twitter.com/oauth/authorize",
				RequestTokenUrl:   "https://api.twitter.com/oauth/request_token",
				AccessTokenUrl:    "https://api.twitter.com/oauth/access_token",
			},
		)
	}
	return twitter
}

// pngに制限しない。 /public/img/emojis/* は全てemojiとして登録する。
func loadEmojis() {
	emojiexp := filepath.Join(path.Dir(path.Dir(curr.Dir())), "public", "img", "emojis", "*")
	files, err := filepath.Glob(emojiexp)
	if err != nil {
		return
	}
	for _, f := range files {
		base := filepath.Base(f)
		name := strings.Replace(base, filepath.Ext(base), "", 1)
		emojis[":"+name+":"] = filepath.Join("/public", "img", "emojis", base)
	}
}
