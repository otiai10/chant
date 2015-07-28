package soundcloud

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
)

// Client ...
type Client struct {
	ID string
}

const (
	// APIURL ...
	APIURL = "http://api.soundcloud.com"
)

// http://api.soundcloud.com/tracks.json?q=claris&client_id=3f4831d902a9686ec6293ed8dd547cd5

// Get ...
func (c *Client) Get(p string, params map[string]string) (*http.Response, error) {
	req, err := http.NewRequest("GET", APIURL, nil)
	if err != nil {
		return nil, err
	}
	req.URL.Path = p

	vals := url.Values{"client_id": []string{c.ID}}

	if params == nil {
		params = map[string]string{}
	}
	for k, v := range params {
		vals.Add(k, v)
	}
	req.URL.RawQuery = vals.Encode()

	proxy := new(http.Client)

	return proxy.Do(req)
}

// Track ...
type Track struct {
	// DownloadURL  string `json:"download_url"`
	URL string `json:"permalink_url"`
}

// SearchTracks ...
func (c *Client) SearchTracks(q string) ([]Track, error) {
	tracks := []Track{}
	res, err := c.Get("/tracks", map[string]string{
		"q": q,
	})
	if err != nil {
		return tracks, fmt.Errorf("client.Get: %v", err)
	}
	if err := json.NewDecoder(res.Body).Decode(&tracks); err != nil {
		return tracks, fmt.Errorf("json.Decode: %v", err)
	}
	if len(tracks) == 0 {
		return tracks, fmt.Errorf("not found")
	}
	return tracks, err
}
