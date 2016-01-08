package bot

import (
	"chant/app/lib/google"
	"chant/app/models"
	"fmt"
	"net/url"
	"regexp"
	"strconv"
)

// GoogleHandler ...
type GoogleHandler struct {
	HandlerBase
}

// Handle ...
func (h GoogleHandler) Handle(event *models.Event, b *models.User) *models.Event {

	wg := delay()
	defer wg.Wait()

	q := h.ReplaceAllString(event.Raw, "")

	c := regexp.MustCompile("[ 　]+([0-9]+)$")
	count := 2
	if c.MatchString(q) {
		m := c.FindAllStringSubmatch(q, 1)
		q = c.ReplaceAllString(q, "")
		if i, err := strconv.Atoi(m[0][1]); err == nil {
			count = i
		}
	}

	client := &google.Client{
		APIKey:               config.Google.APIKey,
		CustomSearchEngineID: config.Google.DefaultCseID,
	}
	resp, err := client.CustomSearch(url.Values{"q": []string{q}})
	if err != nil {
		return models.NewMessage(b, fmt.Sprintf("すまん: %v", err))
	}
	msg := ""
	for i := 0; i < count; i++ {
		entry := resp.Random()
		msg += fmt.Sprintf("[%02d] %s\n", i+1, entry.URL)
	}
	return models.NewMessage(b, msg)
}

// Help ...
func (h GoogleHandler) Help() string {
	return "ググるやつ"
}
