package models

import (
	"net/http"
	"strings"

	"golang.org/x/net/html"
)

// WebEmbed ...
type WebEmbed struct {
	Type        WebContentType `json:"type"`
	ContentType string         `json:"content_type"`
	Link        string         `json:"link"`
	Title       string         `json:"title"`
	Body        string         `json:"body"`
	Image       string         `json:"image"` // Image URL
}

type meta struct {
	Content  string
	Property string
}

func parseMeta(n *html.Node) *meta {
	m := new(meta)
	for _, attr := range n.Attr {
		if attr.Key == "property" {
			m.Property = attr.Val
		}
		if attr.Key == "content" {
			m.Content = attr.Val
		}
	}
	return m
}

func (m *meta) IsDescription() bool {
	return m.Property == "og:description"
}

func (m *meta) IsImage() bool {
	return m.Property == "og:image"
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
	return new(WebEmbed)
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

	node, err := html.Parse(res.Body)
	if err != nil {
		return err
	}

	// {{{
	var walk func(n *html.Node)
	walk = func(n *html.Node) {
		if embed.satisfied() {
			return
		}
		if n.Type == html.ElementNode && n.Data == "title" {
			if n.FirstChild != nil {
				embed.Title = n.FirstChild.Data
				return // Abort children
			}
		}
		if n.Type == html.ElementNode && n.Data == "meta" {
			m := parseMeta(n)
			if m.IsDescription() {
				embed.Body = m.Content
			} else if m.IsImage() {
				embed.Image = m.Content
			}
			return
		}
		for child := n.FirstChild; child != nil; child = child.NextSibling {
			walk(child)
		}
	}
	// }}}

	walk(node)
	return nil
}

func (embed *WebEmbed) parseAsImage(res *http.Response) error {
	embed.Type = TypeImage
	embed.Body = res.Request.URL.String()
	embed.Image = res.Request.URL.String()
	return nil
}

func (embed *WebEmbed) satisfied() bool {
	if embed.Title == "" {
		return false
	}
	if embed.Body == "" {
		return false
	}
	if embed.Image == "" {
		return false
	}
	return true
}
