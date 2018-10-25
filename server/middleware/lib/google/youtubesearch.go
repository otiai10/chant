package google

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/url"
	"time"
)

// YoutubeSearchItem ...
type YoutubeSearchItem struct {
	Kind string `json:"kind"`
	ETag string `json:"etag"`
	ID   struct {
		Kind    string `json:"kind"`
		VideoID string `json:"videoId"`
	} `json:"id"`
	Snippet struct {
		PublishedAt time.Time `json:"publishedAt"`
		ChannelID   string    `json:"channelId"`
		Title       string    `json:"title"`
		Description string    `json:"description"`
		Thumbnails  struct {
			Default struct {
				URL string `json:"url"`
			} `json:"default"`
		} `json:"thumbnails"`
		ChannelTitle         string `json:"channelTitle"`
		LiveBroadcastContent string `json:"liveBroadcastContent"`
	}
}

// YoutubeSearchListResponse ...
type YoutubeSearchListResponse struct {
	Kind     string `json:"kind"`
	ETag     string `json:"etag"`
	PageInfo struct {
		TotalResults   int64 `json:"totalResults"`
		ResultsPerPage int   `json:"resultsPerPage"`
	} `json:"pageInfo"`
	Items []YoutubeSearchItem `json:"items"`
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

// RandomItem returns an item randomly
func (resp *YoutubeSearchListResponse) RandomItem() YoutubeSearchItem {
	rand.Seed(time.Now().Unix())
	return resp.Items[rand.Intn(len(resp.Items))]
}
