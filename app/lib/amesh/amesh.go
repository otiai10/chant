package amesh

import (
	"fmt"
	"net/url"
	"time"
)

const (
	// URL amesh URL
	URL = "http://tokyo-ame.jwa.or.jp"
)

func getURL(p string) string {
	u, _ := url.Parse(URL)
	u.Path = p
	return u.String()
}

func getTimestamp(now time.Time) string {
	// Amesh Image not generated yet
	if now.Minute()%5 == 0 && now.Second() < 30 {
		now = now.Add(-1 * time.Minute)
	}
	min := now.Minute() - now.Minute()%5
	return now.Format("2006010215") + fmt.Sprintf("%02d", min)
}

// Entry ...
type Entry struct {
	URL        string `json:"url"`
	Background string `json:"background"`
	Rain       string `json:"rain"`
	Dictionary string `json:"dictionary"`
}

// Get ...
func Get() Entry {
	return Entry{
		URL:        URL,
		Background: getURL("/map/map000.jpg"),
		Rain:       getURL("/mesh/000/" + getTimestamp(time.Now()) + ".gif"),
		Dictionary: getURL("/map/msk000.png"),
	}
}
