package models

import (
	"net/http"
	"net/url"
	"strings"

	"golang.org/x/net/html"
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

type meta struct {
	Name     string
	Content  string
	Property string
}

func parseMeta(n *html.Node) *meta {
	m := new(meta)
	for _, attr := range n.Attr {
		switch attr.Key {
		case "property":
			m.Property = attr.Val
		case "content":
			m.Content = attr.Val
		case "name":
			m.Name = attr.Val
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

func (m *meta) IsName() bool {
	return m.Property == "og:site_name" || m.Name == "hostname"
}

type link struct {
	Rel  string
	Href string
}

func parseLink(n *html.Node) *link {
	l := new(link)
	for _, attr := range n.Attr {
		switch attr.Key {
		case "rel":
			l.Rel = attr.Val
		case "href":
			l.Href = attr.Val
		}
	}
	return l
}

func (l *link) IsFavicon() bool {
	return l.Rel == "shortcut icon" || l.Rel == "icon"
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
			} else if m.IsName() {
				embed.Site = m.Content
			}
			return
		}
		if n.Type == html.ElementNode && n.Data == "link" {
			l := parseLink(n)
			if l.IsFavicon() {
				embed.Favicon = l.Href
			}
			return
		}
		for child := n.FirstChild; child != nil; child = child.NextSibling {
			walk(child)
		}
	}
	// }}}

	walk(node)

	return embed.resolveRelativeURLs()
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
	if embed.Favicon == "" {
		return false
	}
	if embed.Site == "" {
		return false
	}
	return true
}

func (embed *WebEmbed) resolveRelativeURLs() error {
	base, err := url.Parse(embed.Link)
	if err != nil {
		return err
	}

	img, err := url.Parse(embed.Image)
	if err != nil {
		return err
	}
	if !img.IsAbs() {
		img.Scheme = base.Scheme
		img.Host = base.Host
		embed.Image = img.String()
	}

	fav, err := url.Parse(embed.Favicon)
	if err != nil {
		return err
	}
	if !fav.IsAbs() {
		fav.Scheme = base.Scheme
		fav.Host = base.Host
		embed.Favicon = fav.String()
	}

	return nil
}
