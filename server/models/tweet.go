package models

// TweetEmbed represents response for `GET publish/oembed`
type TweetEmbed struct {
	URL  string `json:"url"`
	HTML string `json:"html"`
}
