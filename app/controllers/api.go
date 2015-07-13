package controllers

import (
	"encoding/xml"
	"io"
	"log"
	"net/http"
	"regexp"

	"chant/app/chatroom"
	"github.com/revel/revel"
)

// APIv1 ...
type APIv1 struct {
	*revel.Controller
}

// RoomStamps とりあえず
func (c APIv1) RoomStamps(id string) revel.Result {
	if !chatroom.Exists(id) {
		return c.RenderJson(map[string]interface{}{
			"stamps": []interface{}{},
		})
	}
	room := chatroom.GetRoom(id)
	stamps := room.Repo.GetAllStamps()
	return c.RenderJson(map[string]interface{}{
		"stamps": stamps,
	})
}

// WebPreview ...
func (c APIv1) WebPreview(url string) revel.Result {
	res, err := http.Get(url)
	if err != nil {
		log.Println(err, url)
		return c.RenderJson(map[string]interface{}{})
	}
	page := new(HTMLPage)
	decoder(res.Body).Decode(page)

	return c.RenderJson(map[string]interface{}{
		"html":    page,
		"summary": page.Summarize(url),
	})
}

func decoder(reader io.Reader) *xml.Decoder {
	dec := xml.NewDecoder(reader)
	dec.Strict = false
	dec.AutoClose = xml.HTMLAutoClose
	dec.Entity = xml.HTMLEntity
	return dec
}

// Summary ...
type Summary struct {
	Title       string `json:"title"`
	Image       string `json:"image"`
	Description string `json:"description"`
	URL         string `json:"url"`
}

func (summary *Summary) setTitle(c string) {
	if len(summary.Title) != 0 || len(c) == 0 {
		return
	}
	summary.Title = c
}
func (summary *Summary) setImage(c string) {
	if len(summary.Image) != 0 || len(c) == 0 {
		return
	}
	summary.Image = c
}
func (summary *Summary) setDescription(c string) {
	if len(summary.Description) != 0 || len(c) == 0 {
		return
	}
	summary.Description = c
}

// HTMLPage ...
type HTMLPage struct {
	Head struct {
		Title string `json:"title" xml:"title"`
		Metas []Meta `json:"metas" xml:"meta"`
		Links []Link `json:"links" xml:"link"`
	} `json:"head" xml:"head"`
} // `xml:"html"`

// Meta ...
type Meta struct {
	Property string `json:"property" xml:"property,attr"`
	Name     string `json:"name"     xml:"name,attr"`
	Content  string `json:"content"  xml:"content,attr"`
}

// Link ...
type Link struct {
	Rel  string `json:"rel"  xml:"rel,attr"`
	Href string `json:"href" xml:"href,attr"`
}

// Summarize ...
func (hp *HTMLPage) Summarize(url string) *Summary {
	summary := new(Summary)
	summary.URL = url
	img := regexp.MustCompile("image")
	desc := regexp.MustCompile("description")
	title := regexp.MustCompile("title")
	for _, meta := range hp.Head.Metas {
		switch {
		case img.MatchString(meta.Property):
			summary.setImage(meta.Content)
		case desc.MatchString(meta.Property):
			summary.setDescription(meta.Content)
		case title.MatchString(meta.Property):
			summary.setTitle(meta.Content)
		}
	}
	summary.setTitle(hp.Head.Title)
	summary.setDescription(hp.Head.Title)
	if len(summary.Image) == 0 {
		for _, link := range hp.Head.Links {
			if link.Rel == "shortcut icon" {
				summary.setImage(link.Href)
				break
			}
		}
	}
	return summary
}
