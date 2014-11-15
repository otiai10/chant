package controllers

import (
	"github.com/mrjones/oauth"
	"github.com/revel/revel"
)

// コンシューマの定義とプロバイダの定義を含んだ
// *oauth.Consumerをつくる
var (
	twitter *oauth.Consumer
)

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
