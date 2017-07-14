package google

import (
	"math/rand"
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

// RandomItem returns an item randomly
func (resp *YoutubeSearchListResponse) RandomItem() YoutubeSearchItem {
	rand.Seed(time.Now().Unix())
	return resp.Items[rand.Intn(len(resp.Items))]
}
