package models

import (
	"net/http"
	"strings"

	"github.com/otiai10/opengraph"
)

// WebEmbed ...
type WebEmbed struct {
	Type        WebContentType `json:"type"`
	ContentType string         `json:"content_type"`
	Link        string         `json:"link"`
	Site        string         `json:"site"`
	Title       string         `json:"title"`
	Body        string         `json:"body"`
	Image       string         `json:"image"`   // image URL
	Favicon     string         `json:"favicon"` // image url
}

// WebContentType ...
type WebContentType string

const (
	// TypeHTML ...
	TypeHTML WebContentType = "html"
	// TypeImage ...
	TypeImage WebContentType = "image"
)

// NewWebEmbed ...
func NewWebEmbed() *WebEmbed {
	return &WebEmbed{
		Favicon: "/favicon.ico",
	}
}

// Parse ...
func (embed *WebEmbed) Parse(res *http.Response) error {
	embed.Link = res.Request.URL.String()
	embed.ContentType = res.Header.Get("Content-Type")
	switch {
	case strings.HasPrefix(embed.ContentType, "text/html"):
		return embed.parseAsHTML(res)
	case strings.HasPrefix(embed.ContentType, "image/"):
		return embed.parseAsImage(res)
	}
	return nil
}

func (embed *WebEmbed) parseAsHTML(res *http.Response) error {

	embed.Type = TypeHTML

	og := opengraph.New(res.Request.URL.String())
	if err := og.Parse(res.Body); err != nil {
		return err
	}
	og.ToAbsURL().Fulfill()
	embed.Favicon = og.Favicon
	embed.Title = og.Title
	embed.Body = og.Description
	if len(og.Image) != 0 {
		embed.Image = og.Image[0].URL
	}
	embed.Site = og.URL.Host

	return nil
}

func (embed *WebEmbed) parseAsImage(res *http.Response) error {
	embed.Type = TypeImage
	embed.Body = res.Request.URL.String()
	embed.Image = res.Request.URL.String()
	return nil
}
