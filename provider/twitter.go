package provider

import (
	"encoding/json"
	"fmt"

	"golang.org/x/net/context"

	"google.golang.org/appengine/urlfetch"

	"github.com/mrjones/oauth"
)

// Twitter ...
type Twitter struct {
	*oauth.Consumer
}

// NewTwitterProvider ...
func NewTwitterProvider(key, secret string) *Twitter {
	/**
	 * TODO: Use OAuth2.0 for aquiring user-level Access Token,
	 *       as soon as Twitter starts supporting user-level OAuth2.
	 */
	var twitter = oauth.NewConsumer(
		key, secret,
		oauth.ServiceProvider{
			AuthorizeTokenUrl: "https://api.twitter.com/oauth/authorize",
			RequestTokenUrl:   "https://api.twitter.com/oauth/request_token",
			AccessTokenUrl:    "https://api.twitter.com/oauth/access_token",
		},
	)
	return &Twitter{twitter}
}

// SetContext ...
func (p *Twitter) SetContext(ctx context.Context) {
	p.HttpClient = urlfetch.Client(ctx)
}

// FetchIdentity ...
func (p *Twitter) FetchIdentity(token *oauth.AccessToken) (*Identity, error) {
	url := "https://api.twitter.com/1.1/account/verify_credentials.json"
	params := map[string]string{}
	res, err := p.Get(url, params, token)
	if err != nil {
		return nil, fmt.Errorf("Failed to fetch identity: %v", err)
	}
	defer res.Body.Close()
	u := struct {
		ScreenName      string `json:"screen_name"`
		ProfileImageURL string `json:"profile_image_url"`
	}{}
	if err := json.NewDecoder(res.Body).Decode(&u); err != nil {
		return nil, fmt.Errorf("Failed to decode identity response: %v", err)
	}
	return &Identity{Name: u.ScreenName, ImageURL: u.ProfileImageURL}, nil
}
