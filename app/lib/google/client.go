package google

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"net/url"
	"time"
)

// Client ...
type Client struct {
	APIKey               string
	CustomSearchEngineID string
}

// CustomSearchResponse ...
type CustomSearchResponse struct {
	Kind string `json:"kind"`
	URL  struct {
		Type     string `json:"type"`
		Template string `json:"template"`
	} `json:"url"`
	Queries struct {
		NextPage []struct {
			Title          string `json:"title"`
			TotalResults   string `json:"totalResults"`
			SearchTerms    string `json:"searchTerms"`
			Count          int    `json:"count"`
			StartIndex     int    `json:"startIndex"`
			InputEncoding  string `json:"inputEncoding"`
			OutputEncoding string `json:"outputEncoding"`
			Safe           string `json:"safe"`
			CX             string `json:"cx"`
			SearchType     string `json:"searchType"`
		} `json:"nextPage"`
		Request []struct {
			Title          string `json:"title"`
			TotalResults   string `json:"totalResults"`
			SearchTerms    string `json:"searchTerms"`
			Count          int    `json:"count"`
			StartIndex     int    `json:"startIndex"`
			InputEncoding  string `json:"inputEncoding"`
			OutputEncoding string `json:"outputEncoding"`
			Safe           string `json:"safe"`
			CX             string `json:"cx"`
			SearchType     string `json:"searchType"`
		} `json:"request"`
	}
	Context struct {
		Title string `json:"title"`
	} `json:"context"`
	SearchInformation struct {
		SearchTime            float64 `json:"searchTime"`
		FormattedSearchTime   string  `json:"formattedSearchTime"`
		TotalResults          string  `json:"totalResults"`
		FormattedTotalResults string  `json:"formattedTotalResults"`
	} `json:"searchInformation"`
	Items []struct {
		Kind        string `json:"kind"`
		Title       string `json:"title"`
		HTMLTitle   string `json:"htmlTitle"`
		Link        string `json:"link"`
		DisplayLink string `json:"displayLink"`
		Snippet     string `json:"snippet"`
		HTMLSnippet string `json:"htmlSnippet"`
		Mime        string `json:"mime"`
		FileFormat  string `json:"fileFormat"`
		Image       struct {
			ContextLink     string `json:"contextLink"`
			Height          int    `json:"height"`
			Width           int    `json:"width"`
			ByteSize        int64  `json:"byteSize"`
			ThumbnailLink   string `json:"thumbnailLink"`
			ThumbnailHeight int    `json:"thumbnailHeight"`
			ThumbnailWidth  int    `json:"thumbnailWidth"`
		}
	} `json:"items"`
	// if error
	Error struct {
		Errors []struct {
			Domain  string `json:"domain"`
			Reason  string `json:"reason"`
			Message string `json:"message"`
		} `json:"errors"`
		Code    int    `json:"code"`
		Message string `json:"message"`
	} `json:"error"`
}

// YoutubeSearchListResponse ...
type YoutubeSearchListResponse struct {
	Kind     string `json:"kind"`
	ETag     string `json:"etag"`
	PageInfo struct {
		TotalResults   int64 `json:"totalResults"`
		ResultsPerPage int   `json:"resultsPerPage"`
	} `json:"pageInfo"`
	Items []struct {
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
	} `json:"items"`
}

// Random ...
func (resp *CustomSearchResponse) Random() *SearchImageResultEntry {
	if len(resp.Items) == 0 {
		return nil
	}
	rand.Seed(time.Now().Unix())
	i := rand.Intn((len(resp.Items)))
	a := resp.Items[i] // とりあえず
	resp.Items = append(resp.Items[:i], resp.Items[i+1:]...)
	return &SearchImageResultEntry{
		URL: a.Link,
	}
}

// YoutubeSearch ...
func (c *Client) YoutubeSearch(query url.Values) (*YoutubeSearchListResponse, error) {
	query.Add("key", c.APIKey)
	baseURL := "https://www.googleapis.com/youtube/v3/search"

	res, err := http.Get(baseURL + "?" + query.Encode())
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

	res, err := http.Get(baseURL + "?" + query.Encode())
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
func (c *Client) SearchImage(keyword string) (*CustomSearchResponse, error) {
	q := url.Values{}
	q.Add("q", keyword)
	q.Add("searchType", "image")
	return c.CustomSearch(q)
}

// SearchGIF ...
func (c *Client) SearchGIF(keyword string) (*CustomSearchResponse, error) {
	q := url.Values{}
	q.Add("q", keyword)
	q.Add("searchType", "image")
	q.Add("fileType", "gif")
	q.Add("hq", "animated")
	return c.CustomSearch(q)
}
