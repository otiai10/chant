package bot

import (
	"chant/app/lib/google"
	"chant/app/models"
	"fmt"
	"math/rand"
	"net/url"
	"regexp"
	"time"
)

// YoutubeHandler ...
type YoutubeHandler struct {
	*regexp.Regexp
}

// Match ...
func (h YoutubeHandler) Match(event *models.Event) bool {
	return h.MatchString(event.Raw)
}

// Handle ...
func (h YoutubeHandler) Handle(event *models.Event, b *models.User) *models.Event {
	q := h.ReplaceAllString(event.Raw, "")

	client := &google.Client{
		APIKey: config.Google.APIKey,
	}
	query := url.Values{}
	query.Add("q", q)
	query.Add("part", "snippet")
	query.Add("maxResults", "40")
	resp, err := client.YoutubeSearch(query)
	if err != nil {
		return models.NewMessage(b, fmt.Sprintf("すまん: %v", err))
	}

	// とりあえず
	rand.Seed(time.Now().Unix())
	a := resp.Items[rand.Intn(len(resp.Items))]
	return models.NewMessage(b, "https://www.youtube.com/watch?v="+a.ID.VideoID)
}
