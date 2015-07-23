package google

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"net/url"
	"time"
)

// SearchImageResponse ...
type SearchImageResponse struct {
	ResponseData struct {
		Results []*SearchImageResultEntry `json:"results"`
	} `json:"responseData"`
	ResponseDetails string `json:"responseDetails"`
	ResponseStatus  int    `json:"responseStatus"`
}

// SearchImageResultEntry ...
type SearchImageResultEntry struct {
	URL     string `json:"url"`
	Width   string `json:"width"`
	Height  string `json:"height"`
	Title   string `json:"titleNoFormatting"`
	Content string `json:"contentNoFormatting"`
	Context string `json:"originalContextUrl"`
}

// Random ...
func (resp *SearchImageResponse) Random() *SearchImageResultEntry {
	if len(resp.ResponseData.Results) == 0 {
		return nil
	}
	rand.Seed(time.Now().Unix())
	return resp.ResponseData.Results[rand.Intn(len(resp.ResponseData.Results))]
}

// SearchImage ...
func SearchImage(keyword string) (*SearchImageResponse, error) {
	baseURL := "https://ajax.googleapis.com/ajax/services/search/images"
	q := url.Values{}
	q.Add("v", "1.0")
	q.Add("rsz", "8")
	q.Add("q", keyword)
	res, err := http.Get(baseURL + "?" + q.Encode())
	if err != nil {
		return nil, err
	}
	resp := new(SearchImageResponse)

	if err := json.NewDecoder(res.Body).Decode(resp); err != nil {
		return nil, err
	}

	if len(resp.ResponseData.Results) == 0 {
		return nil, fmt.Errorf("not found for `%s`", keyword)
	}

	return resp, nil
}
