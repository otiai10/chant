package twitter

import (
	"net/http"

	"github.com/mrjones/oauth"
	"github.com/otiai10/chant/src/configs"
)

// Client ...
type Client struct {
	*oauth.Consumer
}

// NewClient ...
func NewClient(client *http.Client) *Client {
	consumer := oauth.NewCustomHttpClientConsumer(
		configs.TwitterConsumerKey(),
		configs.TwitterConsumerSecret(),
		oauth.ServiceProvider{
			AuthorizeTokenUrl: "https://api.twitter.com/oauth/authorize",
			RequestTokenUrl:   "https://api.twitter.com/oauth/request_token",
			AccessTokenUrl:    "https://api.twitter.com/oauth/access_token",
		},
		client,
	)
	return &Client{consumer}
}

// RequestTokenFromHTTPRequest ...
func RequestTokenFromHTTPRequest(r *http.Request) *oauth.RequestToken {
	rtoken := &oauth.RequestToken{}
	for _, cookie := range r.Cookies() {
		switch {
		case cookie.Name == "request_token":
			rtoken.Token = cookie.Value
		case cookie.Name == "request_secret":
			rtoken.Secret = cookie.Value
		}
	}
	return rtoken
}

// GetAccount ...
func (c *Client) GetAccount(accessToken *oauth.AccessToken) (*http.Response, error) {
	return c.Get(
		"https://api.twitter.com/1.1/account/verify_credentials.json",
		map[string]string{},
		accessToken,
	)
}
