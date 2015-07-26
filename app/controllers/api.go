package controllers

import (
	"bytes"
	"chant/app/models"
	"encoding/json"
	"encoding/xml"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"regexp"

	"chant/app/chatroom"

	"github.com/revel/revel"
)

// APIv1 ...
type APIv1 struct {
	*revel.Controller
}

// RoomStamps とりあえず
func (c APIv1) RoomStamps(id, token string) revel.Result {
	if !chatroom.Exists(id) {
		return c.RenderJson(map[string]interface{}{
			"stamps": []interface{}{},
		})
	}
	room := chatroom.GetRoom(id, token)
	if room == nil {
		return c.RenderJson(map[string]interface{}{
			"stamps": []interface{}{},
		})
	}
	stamps := room.Repo.GetAllStamps()
	return c.RenderJson(map[string]interface{}{
		"stamps": stamps,
	})
}

// RoomMessages とりあえず
func (c APIv1) RoomMessages(id, token string) revel.Result {
	if !chatroom.Exists(id) {
		return c.RenderJson(map[string]interface{}{
			"messages": []interface{}{},
		})
	}
	room := chatroom.GetRoom(id, token)
	if room == nil {
		return c.RenderJson(map[string]interface{}{
			"stamps": []interface{}{},
		})
	}
	// メッセージアーカイブを、最新の、最大10件を取得する
	messages := room.Repo.GetMessages(10, -1)
	return c.RenderJson(map[string]interface{}{
		"messages": messages,
	})
}

// RoomSay とりあえず
func (c APIv1) RoomSay(id, token string) revel.Result {
	c.Request.Format = "json"
	// FIXME: めんどいからここで
	type params struct {
		Type  string       `json:"type"`
		Value string       `json:"value"`
		User  *models.User `json:"user"`
	}
	p := new(params)
	if err := json.NewDecoder(c.Request.Body).Decode(p); err != nil {
		c.Response.Status = http.StatusBadRequest
		return c.RenderError(err)
	}

	raw, err := json.Marshal(struct {
		Type string `json:"type"`
		Raw  string `json:"raw"`
	}{p.Type, p.Value})

	if err != nil {
		c.Response.Status = http.StatusBadRequest
		return revel.ErrorResult{
			Error: err,
		}
	}

	room := chatroom.GetRoom(id, chatroom.PrivilegeAPIToken)

	event, err := room.Say(p.User, string(raw))
	if err != nil {
		c.Response.Status = http.StatusBadRequest
		return revel.ErrorResult{
			Error: err,
		}
	}

	return c.RenderJson(map[string]interface{}{
		"params":  p,
		"created": event,
	})
}

// WebPreview ...
func (c APIv1) WebPreview(u string) revel.Result {
	res, err := http.Get(u)
	if err != nil {
		return c.RenderJson(map[string]interface{}{})
	}
	if regexp.MustCompile("^ima?ge?/.*").MatchString(res.Header.Get("Content-Type")) {
		return c.RenderJson(map[string]interface{}{
			"content": "image",
			"url":     u,
		})
	}

	// clean response body
	b, _ := ioutil.ReadAll(res.Body)
	b = regexp.MustCompile("\\<script[\\S\\s]+?\\</script\\>").ReplaceAll(b, []byte{})
	buf := bytes.NewBuffer(b)

	page := new(HTMLPage)
	err = decoder(buf).Decode(page)
	if err != nil {
		log.Println("[WebPreview]", err)
	}

	return c.RenderJson(map[string]interface{}{
		"html":    page,
		"summary": page.Summarize(u),
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
func (hp *HTMLPage) Summarize(u string) *Summary {
	summary := new(Summary)
	summary.URL = u
	img := regexp.MustCompile("image")
	desc := regexp.MustCompile("description")
	title := regexp.MustCompile("title")
	icon := regexp.MustCompile("icon")
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
			if icon.MatchString(link.Rel) {
				summary.setImage(link.Href)
				break
			}
		}
	}
	if len(summary.Image) == 0 {
		v, _ := url.Parse(u)
		summary.setImage(v.Scheme + "://" + v.Host + "/favicon.ico")
	}
	return summary
}
