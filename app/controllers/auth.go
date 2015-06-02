package controllers

import (
	"encoding/json"
	"fmt"

	"github.com/mrjones/oauth"
	"github.com/revel/revel"
)

// Auth action controller
type Auth struct {
	*revel.Controller
}

func getCallbackURL() string {
	if callback, ok := revel.Config.String("auth.callback"); ok && callback != "" {
		return fmt.Sprintf("http://%s/auth/callback", callback)
	}
	host, _ := revel.Config.String("http.host")
	port, _ := revel.Config.String("http.port")
	if port != "" {
		port = ":" + port
	}
	return fmt.Sprintf("http://%s%s/auth/callback", host, port)
}

// Index `GET /auth`
// 1) すでにセッションがある -> Roomへ
// 2) TwitterのAuth画面へ
func (c Auth) Index() revel.Result {

	if _, nameExists := c.Session["screenName"]; nameExists {
		// 既にセッションを持っているのでルームにリダイレクトする
		return c.Redirect(Application.Index)
	}
	// まずはverifier獲得した状態でリダイレクトするように促す
	// このアプリケーションのコンシューマキーとコンシューマシークレットを用いて
	// 一時的に使えるrequestTokenの取得を試みる
	requestToken, url, err := Twitter().GetRequestTokenAndUrl(getCallbackURL())
	if err == nil {
		// 一時的に使えるrequestTokenが取得できたので、サーバ側で一次保存しておく
		c.Session["requestToken"] = requestToken.Token
		c.Session["requestSecret"] = requestToken.Secret
		// あとは、ユーザの問題
		// oauth_verifierを取ってきてもらう
		return c.Redirect(url)
	}
	revel.ERROR.Println(
		"そもそもコンシューマキーを用いてリクエストトークン取得できなかったで御座る",
		err,
	)

	// 何が起きてもとりあえずトップへ飛ばす
	return c.Redirect(Application.Index)
}

// Callback ...
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
	accessToken, err := Twitter().AuthorizeToken(requestToken, oauth_verifier)
	if err == nil {
		// 成功したので、これを用いてユーザ情報を取得する
		resp, _ := Twitter().Get(
			//"https://api.twitter.com/1.1/statuses/mentions_timeline.json",
			"https://api.twitter.com/1.1/account/verify_credentials.json",
			map[string]string{},
			accessToken,
		)
		defer resp.Body.Close()
		account := struct {
			Name            string `json:"name"`
			ProfileImageURL string `json:"profile_image_url"`
			ScreenName      string `json:"screen_name"`
		}{}
		_ = json.NewDecoder(resp.Body).Decode(&account)
		// }}}
		// セッションに格納する
		c.Session["name"] = account.Name
		c.Session["screenName"] = account.ScreenName
		c.Session["profileImageUrl"] = account.ProfileImageURL
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
