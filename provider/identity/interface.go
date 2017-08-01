package identity

import (
	"os"

	"golang.org/x/net/context"

	"github.com/mrjones/oauth"
)

// Provider ...
type Provider interface {
	SetContext(context.Context)
	GetRequestTokenAndUrl(string) (*oauth.RequestToken, string, error)
	AuthorizeToken(*oauth.RequestToken, string) (*oauth.AccessToken, error)
	FetchIdentity(*oauth.AccessToken) (*Identity, error)
	// Get(string, map[string]string, *oauth.AccessToken) (*http.Response, error)
}

// SharedInstance ...
var SharedInstance Provider

// Initialize ...
func Initialize(name string) error {
	switch name {
	case "twitter":
		fallthrough
	default:
		SharedInstance = NewTwitterProvider(
			os.Getenv("TWITTER_CONSUMER_KEY"),
			os.Getenv("TWITTER_CONSUMER_SECRET"),
		)
	}
	return nil
}

// Identity ...
type Identity struct {
	Provider string `json:"provider"`
	ID       string `json:"id"`
	Name     string `json:"name"`
	ImageURL string `json:"image_url"`
}
