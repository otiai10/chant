package controllers

import (
	"chant/app/models"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"chant/app/chatroom"

	"github.com/PuerkitoBio/goquery"
	"github.com/otiai10/cachely"
	"github.com/otiai10/curr"
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
	c.Request.Format = "json"
	v, err := url.Parse(u)
	if err != nil {
		return c.RenderError(err)
	}
	// avoid basic auth
	if v.Host == revel.Config.StringDefault("http.host", "localhost") {
		v.Host = fmt.Sprintf("%s:%s", "localhost", revel.Config.StringDefault("http.port", "14000"))
	}
	res, err := cachely.Get(v.String())
	if err != nil {
		return c.RenderError(err)
	}
	defer res.Body.Close()
	if regexp.MustCompile("^ima?ge?/.*").MatchString(res.Header.Get("Content-Type")) {
		return c.RenderJson(map[string]string{"content": "image", "url": u})
	}
	if regexp.MustCompile("^video/.*").MatchString(res.Header.Get("Content-Type")) {
		return c.RenderJson(map[string]string{"content": "video", "url": u})
	}

	doc, err := goquery.NewDocumentFromResponse(res)
	if err != nil {
		return c.RenderError(err)
	}

	summary := &Summary{URL: u, Original: v}

	defer func() {
		if r := recover(); r != nil {
			log.Println("defered recover:", r)
		}
	}()

	summary.Title = summary.GetTitle(doc)
	summary.Image = summary.GetImage(doc)
	summary.Description = summary.GetDescription(doc)

	return c.RenderJson(map[string]interface{}{
		"summary": summary,
	})
}

// Summary ...
type Summary struct {
	Title       string   `json:"title"`
	Image       string   `json:"image"`
	Description string   `json:"description"`
	URL         string   `json:"url"`
	Original    *url.URL `json:"-"`
}

// GetTitle ...
func (s *Summary) GetTitle(doc *goquery.Document) string {
	og := doc.Find("meta[property='og:title']").First()
	if c, ok := og.Attr("content"); ok && c != "" {
		return c
	}
	if title := doc.Find("title").First().Text(); title != "" {
		return title
	}
	return s.URL
}

// GetImage ...
func (s *Summary) GetImage(doc *goquery.Document) string {
	og := doc.Find("meta[property='og:image']").First()
	if c, ok := og.Attr("content"); ok && c != "" {
		return s.GetAbsURL(c)
	}
	img := doc.Find("img").First()
	if src, ok := img.Attr("src"); ok && src != "" {
		return s.GetAbsURL(src)
	}
	link := doc.Find("link[rel='shortcut icon']").First()
	if href, ok := link.Attr("href"); ok && href != "" {
		return s.GetAbsURL(href)
	}
	return "/public/img/icon.png"
}

// GetDescription ...
func (s *Summary) GetDescription(doc *goquery.Document) string {
	og := doc.Find("meta[property='og:description']").First()
	if c, ok := og.Attr("content"); ok && c != "" {
		return c
	}
	return s.GetTitle(doc)
}

// GetAbsURL ...
func (s *Summary) GetAbsURL(rel string) string {
	u, err := url.Parse(rel)
	if err != nil {
		return rel
	}
	return s.Original.ResolveReference(u).String()
}

// FileUpload ...
func (c APIv1) FileUpload(id, token, name string, oppai *os.File) revel.Result {
	c.Request.Format = "json"

	user, err := models.RestoreUserFromJSON(c.Session["user_raw"])
	if err != nil {
		return c.RenderError(err)
	}

	projectpath := filepath.Dir(filepath.Dir(curr.Dir()))
	pubdir := filepath.Join("/public/img/uploads", time.Now().Format("20060102"))
	if err := os.Mkdir(filepath.Join(projectpath, pubdir), os.ModePerm); err != nil {
		// 	return c.RenderError(err) // file exists
	}
	publicpath := filepath.Join(pubdir, genEncodedFileName(name))
	destpath := filepath.Join(projectpath, publicpath)
	if err := os.Rename(oppai.Name(), destpath); err != nil {
		return c.RenderError(err)
	}
	room := chatroom.GetRoom(id, "tmp_X-API")
	room.Say(user, fmt.Sprintf(`{"type":"message","raw":"%s"}`, fullpath(publicpath)))
	c.Params = &revel.Params{}
	return c.RenderJson(map[string]interface{}{
		"message": "created",
		"url":     publicpath,
	})
}

func fullpath(p string) string {
	u := url.URL{Scheme: "http"}
	if revel.DevMode {
		u.Host = strings.Join([]string{
			revel.Config.StringDefault("http.host", "localhost"),
			revel.Config.StringDefault("http.port", "14000"),
		}, ":")
	} else {
		u.Host = revel.Config.StringDefault("auth.callback", "chant.otiai10.com")
	}
	u.Path = p
	return u.String()
}

func genEncodedFileName(original string) string {
	ext := strings.ToLower(filepath.Ext(original))
	return base64.StdEncoding.EncodeToString([]byte(time.Now().String() + original))[:32] + ext
}
