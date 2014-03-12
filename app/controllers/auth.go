package controllers

import (
	"github.com/mrjones/oauth"
	"github.com/robfig/revel"

	"encoding/json"
	"fmt"

	"chant/conf/my"
)

// コンシューマの定義とプロバイダの定義を含んだ
// *oauth.Consumerをつくる
var twitter = oauth.NewConsumer(
	// コンシューマの定義
	my.AppTwitterConsumerKey,
	my.AppTwitterConsumerSecret,
	// プロバイダの定義
	oauth.ServiceProvider{
		AuthorizeTokenUrl: "https://api.twitter.com/oauth/authorize",
		RequestTokenUrl:   "https://api.twitter.com/oauth/request_token",
		AccessTokenUrl:    "https://api.twitter.com/oauth/access_token",
	},
)

type Auth struct {
	// embed
	*revel.Controller
}

func (c Auth) Index(oauth_verifier string) revel.Result {

	if _, nameExists := c.Session["screenName"]; nameExists {
		// 既にセッションを持っているのでルームにリダイレクトする
		return c.Redirect(Room.Index)
	}

	// oauth_verifierが無い状態でこのURLを叩いたとき
	// つまり、ユーザの最初のAuthenticateへのアクセスである

	// まずはverifier獲得した状態でリダイレクトするように促す
	// このアプリケーションのコンシューマキーとコンシューマシークレットを用いて
	// 一時的に使えるrequestTokenの取得を試みる
	host, _ := revel.Config.String("http.host")
	port, _ := revel.Config.String("http.port")
  if ! revel.Config.BoolDefault("mode.dev", true) {
    port = ""
  }
	requestToken, url, err := twitter.GetRequestTokenAndUrl(fmt.Sprintf("http://%s:%s/auth/callback", host, port))
	if err == nil {
		// 一時的に使えるrequestTokenが取得できたので、サーバ側で一次保存しておく
		c.Session["requestToken"] = requestToken.Token
		c.Session["requestSecret"] = requestToken.Secret
		// あとは、ユーザの問題
		// oauth_verifierを取ってきてもらう
		return c.Redirect(url)
	} else {
		revel.ERROR.Println(
			"そもそもコンシューマキーを用いてリクエストトークン取得できなかったで御座る",
			err,
		)
	}

	// 何が起きてもとりあえずトップへ飛ばす
	return c.Redirect(Application.Index)
}

func (c *Auth) Callback(oauth_verifier string) revel.Result {

	// TODO: oauth_verifierあるとか無いとか。
	// 　　: URL直打ちだったらあり得る

	// RequestTokenの復元
	requestToken := &oauth.RequestToken{
		c.Session["requestToken"],
		c.Session["requestSecret"],
	}
	// 不要になったので捨てる
	delete(c.Session, "requestToken")
	delete(c.Session, "requestSecret")
	// これと、oauth_verifierを用いてaccess_tokenを獲得する
	accessToken, err := twitter.AuthorizeToken(requestToken, oauth_verifier)
	if err == nil {
		// 成功したので、これを用いてユーザ情報を取得する
		resp, _ := twitter.Get(
			//"https://api.twitter.com/1.1/statuses/mentions_timeline.json",
			"https://api.twitter.com/1.1/account/verify_credentials.json",
			map[string]string{},
			accessToken,
		)
		defer resp.Body.Close()
		account := struct {
			Name            string `json:"name"`
			ProfileImageUrl string `json:"profile_image_url"`
			ScreenName      string `json:"screen_name"`
		}{}
		_ = json.NewDecoder(resp.Body).Decode(&account)
		// }}}
		// セッションに格納する
		c.Session["name"] = account.Name
		c.Session["screenName"] = account.ScreenName
		c.Session["profileImageUrl"] = account.ProfileImageUrl
	} else {
		// 失敗したので、エラーを吐く
		revel.ERROR.Println("requestTokenとoauth_verifierを用いてaccessTokenを得たかったけど失敗したの図:\t", err)
	}

	return c.Redirect(Application.Index)
}

func init() {
	// revel.Controller.*が実行されるときに必ず呼べる？
	// twitter.Debug(true)
}
