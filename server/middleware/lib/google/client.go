package google

import (
	"fmt"
	"net/http"
	"os"

	"context"

	"github.com/otiai10/chant/server/middleware"
)

// Client represents API Client for Google Search API
type Client struct {
	APIKey               string
	CustomSearchEngineID string
	Referer              string
	*http.Client
}

// NewClient provides *google.Client, or errors if required env variables not given.
func NewClient(ctx context.Context) (*Client, error) {
	httpclient := middleware.HTTPClient(ctx)
	key := os.Getenv("GOOGLE_SEARCH_API_KEY")
	if key == "" {
		return nil, fmt.Errorf("Requiredd evn var `GOOGLE_SEARCH_API_KEY` is not set, please tell admin to add it to `app/secret.yaml`")
	}
	engineID := os.Getenv("GOOGLE_SEARCH_ENGINE_ID")
	if engineID == "" {
		return nil, fmt.Errorf("Requiredd evn var `GOOGLE_SEARCH_ENGINE_ID` is not set, please tell admin to add it to `app/secret.yaml`")
	}
	return &Client{
		APIKey:               key,
		CustomSearchEngineID: engineID,
		Client:               httpclient,
	}, nil
}

// Get proxies GET request and set HTTP Referer header.
func (c *Client) Get(url string) (*http.Response, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	if c.Referer != "" {
		req.Header.Set("Referer", c.Referer)
	}
	return c.Do(req)
}
