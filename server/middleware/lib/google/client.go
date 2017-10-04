package google

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"

	"context"

	"github.com/otiai10/chant/server/middleware"
)

// Client represents API Client for Google Search API
type Client struct {
	APIKey               string
	CustomSearchEngineID string
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

// YoutubeSearch ...
func (c *Client) YoutubeSearch(query url.Values) (*YoutubeSearchListResponse, error) {
	query.Add("key", c.APIKey)
	baseURL := "https://www.googleapis.com/youtube/v3/search"

	res, err := c.Get(baseURL + "?" + query.Encode())
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	resp := new(YoutubeSearchListResponse)
	if err := json.NewDecoder(res.Body).Decode(resp); err != nil {
		return nil, err
	}

	if len(resp.Items) == 0 {
		return nil, fmt.Errorf("not found")
	}

	return resp, nil
}

// CustomSearch ...
func (c *Client) CustomSearch(query url.Values) (*CustomSearchResponse, error) {

	query.Add("cx", c.CustomSearchEngineID)
	query.Add("key", c.APIKey)

	baseURL := "https://www.googleapis.com/customsearch/v1"

	res, err := c.Get(baseURL + "?" + query.Encode())
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	resp := new(CustomSearchResponse)

	if err := json.NewDecoder(res.Body).Decode(resp); err != nil {
		return nil, err
	}

	if resp.Error.Code != 0 {
		return nil, fmt.Errorf("Google said: `%s`", resp.Error.Message)
	}

	if len(resp.Items) == 0 {
		return nil, fmt.Errorf("not found for")
	}

	return resp, nil
}

// SearchImage ...
func (c *Client) SearchImage(query string, start int) (*CustomSearchResponse, error) {
	num := 5
	q := url.Values{}
	q.Add("q", query)
	q.Add("searchType", "image")
	q.Add("num", fmt.Sprintf("%d", num))
	q.Add("start", fmt.Sprintf("%d", start))
	return c.CustomSearch(q)
}

// SearchGIF ...
func (c *Client) SearchGIF(keyword string) (*CustomSearchResponse, error) {
	num := 5
	start := 1 // 6, 11, 26, 31, ...
	q := url.Values{}
	q.Add("q", keyword)
	q.Add("searchType", "image")
	q.Add("fileType", "gif")
	q.Add("hq", "animated")
	q.Add("num", fmt.Sprintf("%d", num))
	q.Add("start", fmt.Sprintf("%d", start))
	return c.CustomSearch(q)
}
