package models

import (
	"net/http"

	"golang.org/x/net/html"
)

// WebPreview ...
type WebPreview struct {
	Type  WebContentType `json:"type"`
	Title string         `json:"title"`
	Body  string         `json:"body"`
	Image string         `json:"image"` // Image URL
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

// NewWebPreview ...
func NewWebPreview() *WebPreview {
	return new(WebPreview)
}

// Parse ...
func (preview *WebPreview) Parse(res *http.Response) error {
	switch res.Header.Get("Content-Type") {
	case "text/html":
		return preview.parseAsHTML(res)
	case "image/jpeg", "image/png":
		return preview.parseAsImage(res)
	}
	return nil
}

func (preview *WebPreview) parseAsHTML(res *http.Response) error {

	preview.Type = TypeHTML

	node, err := html.Parse(res.Body)
	if err != nil {
		return err
	}

	// {{{
	var walk func(n *html.Node)
	walk = func(n *html.Node) {
		if preview.satisfied() {
			return
		}
		if n.Type == html.ElementNode && n.Data == "title" {
			if n.FirstChild != nil {
				preview.Title = n.FirstChild.Data
				return // Abort children
			}
		}
		if n.Type == html.ElementNode && n.Data == "meta" {
			m := parseMeta(n)
			if m.IsDescription() {
				preview.Body = m.Content
			} else if m.IsImage() {
				preview.Image = m.Content
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

func (preview *WebPreview) parseAsImage(res *http.Response) error {
	preview.Type = TypeImage
	preview.Body = res.Request.URL.String()
	preview.Image = res.Request.URL.String()
	return nil
}

func (preview *WebPreview) satisfied() bool {
	if preview.Title == "" {
		return false
	}
	if preview.Body == "" {
		return false
	}
	if preview.Image == "" {
		return false
	}
	return true
}
