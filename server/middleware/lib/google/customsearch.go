package google

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"net/url"
	"time"
)

// CustomSearchItem ...
type CustomSearchItem struct {
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
	Items []CustomSearchItem `json:"items"`
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

// CustomSearch ...
func (c *Client) CustomSearch(query url.Values) (*CustomSearchResponse, error) {

	query.Add("cx", c.CustomSearchEngineID)
	query.Add("key", c.APIKey)

	baseURL := "https://www.googleapis.com/customsearch/v1"

	req, err := http.NewRequest("GET", baseURL+"?"+query.Encode(), nil)
	if c.Referer != "" {
		req.Header.Set("Referer", "http://localhost:8080")
	}

	res, err := c.Do(req)
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

// RandomItem returns an item randomly
func (resp *CustomSearchResponse) RandomItem() CustomSearchItem {
	rand.Seed(time.Now().Unix())
	return resp.Items[rand.Intn(len(resp.Items))]
}
