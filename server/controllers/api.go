package controllers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"path"

	"github.com/otiai10/chant/provider/storage"
	"github.com/otiai10/chant/server/filters"
	"github.com/otiai10/chant/server/hook/bot/slashcommands"
	"github.com/otiai10/chant/server/middleware"
	"github.com/otiai10/chant/server/models"
	"github.com/otiai10/marmoset"
	"github.com/otiai10/totsuzen"
)

// GetTweetEmbed ...
func GetTweetEmbed(w http.ResponseWriter, r *http.Request) {

	render := marmoset.Render(w)

	u, _ := url.Parse("https://publish.twitter.com/oembed")
	q := u.Query()
	q.Add("url", r.FormValue("url"))
	u.RawQuery = q.Encode()

	ctx := middleware.Context(r)
	client := middleware.HTTPClient(ctx)
	res, err := client.Get(u.String())
	if err != nil {
		render.JSON(http.StatusBadGateway, marmoset.P{
			"message": err.Error(),
		})
		return
	}
	defer res.Body.Close()

	tweet := new(models.TweetEmbed)
	if err := json.NewDecoder(res.Body).Decode(tweet); err != nil {
		render.JSON(http.StatusBadRequest, marmoset.P{
			"message": err.Error(),
		})
	}

	render.JSON(http.StatusOK, tweet)
}

// Totsuzenize ...
func Totsuzenize(w http.ResponseWriter, r *http.Request) {

	render := marmoset.Render(w)

	ctx := middleware.Context(r)

	id := r.FormValue("id")
	body := struct {
		Text string `json:"text"`
	}{}
	json.NewDecoder(r.Body).Decode(&body)

	user := filters.RequestUser(r)
	if user == nil {
		middleware.Log(ctx).Debugf("Foo: %+v", user)
		render.JSON(http.StatusFound, marmoset.P{
			"message": "No user",
		})
		return
	}

	m := models.NewMessage(
		totsuzen.NewToken(body.Text).Totsuzenize().Text,
		filters.RequestUser(r),
	)
	if err := m.Push(ctx); err != nil {
		render.JSON(http.StatusInternalServerError, marmoset.P{
			"message": err.Error(),
		})
		return
	}

	render.JSON(http.StatusOK, marmoset.P{
		"id":   id,
		"text": totsuzen.NewToken(body.Text).Totsuzenize().Text,
	})
}

// MessageNotification ...
func MessageNotification(w http.ResponseWriter, r *http.Request) {
	render := marmoset.Render(w)
	body := struct {
		Targets []*models.User `json:"targets"`
		Sender  *models.User   `json:"sender"`
		Text    string         `json:"text"`
	}{}
	defer r.Body.Close()
	ctx := middleware.Context(r)
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		render.JSON(http.StatusBadRequest, marmoset.P{
			"messsage": err.Error(),
		})
		return
	}
	push := middleware.NewPushClient(ctx)
	for _, target := range body.Targets {
		for _, device := range target.Notification.Devices {
			if err := push.Send(middleware.Notification{
				Title: body.Sender.Name,
				Body:  body.Text,
				Icon:  body.Sender.ImageURL,
			}, device.Token); err != nil {
				middleware.Log(ctx).Debugf("Push Failed: %+v", err)
			}
		}
	}
	render.JSON(http.StatusOK, marmoset.P{})
}

// GetURLEmbed ...
func GetURLEmbed(w http.ResponseWriter, r *http.Request) {
	render := marmoset.Render(w)
	u, err := url.QueryUnescape(r.FormValue("url"))
	if err != nil {
		render.JSON(http.StatusBadRequest, marmoset.P{
			"message": fmt.Errorf("Failed to unescape parameter: %v", err),
		})
		return
	}
	client := middleware.HTTPClient(middleware.Context(r))
	res, err := client.Get(u)
	if err != nil {
		render.JSON(http.StatusBadRequest, marmoset.P{
			"message": fmt.Errorf("Failed to fetch resource of given parameter: %v", err),
		})
		return
	}
	defer res.Body.Close()
	embed := models.NewWebEmbed()
	if err := embed.Parse(res); err != nil {
		render.JSON(http.StatusBadRequest, marmoset.P{
			"message": fmt.Errorf("Failed to parse response: %v", err),
		})
		return
	}
	render.JSON(http.StatusOK, marmoset.P{
		"contenttype": res.Header.Get("Content-Type"),
		"embed":       embed,
	})
}

// SlashCommand ...
func SlashCommand(w http.ResponseWriter, r *http.Request) {
	render := marmoset.Render(w)
	body := &slashcommands.SlashCommandRequest{Request: r}
	if err := json.NewDecoder(r.Body).Decode(body); err != nil {
		render.JSON(http.StatusBadRequest, marmoset.P{"message": err.Error()})
		return
	}
	if err := slashcommands.For(body.Command).Handle(body); err != nil {
		render.JSON(http.StatusBadRequest, marmoset.P{"message": err.Error()})
		return
	}
	render.JSON(http.StatusOK, marmoset.P{
		"message": "ok",
	})
}

// ImageUpload ...
func ImageUpload(w http.ResponseWriter, r *http.Request) {

	render := marmoset.Render(w)
	f, h, err := r.FormFile("image")
	if err != nil {
		render.JSON(http.StatusBadRequest, marmoset.P{"message": err.Error()})
		return
	}
	defer r.Body.Close()

	ctx := middleware.Context(r)
	key := path.Join("uploads", h.Filename)

	writer, err := storage.SharedInstance.NewWriter(ctx, key)
	if err != nil {
		render.JSON(http.StatusBadRequest, marmoset.P{"message": err.Error()})
		return
	}
	defer writer.Close()
	writer.ContentType(h.Header.Get("Content-Type"))

	body, err := ioutil.ReadAll(f)
	if err != nil {
		render.JSON(http.StatusBadRequest, marmoset.P{"message": err.Error()})
		return
	}

	if _, err := writer.Write(body); err != nil {
		render.JSON(http.StatusBadRequest, marmoset.P{"message": err.Error()})
		return
	}

	message := models.NewMessage(fmt.Sprintf("[%s]", key), filters.RequestUser(r))
	if err := message.Push(ctx); err != nil {
		render.JSON(http.StatusBadRequest, marmoset.P{"message": err.Error()})
		return
	}
	render.JSON(http.StatusOK, marmoset.P{"key": key})
}

// ImageDownload ...
func ImageDownload(w http.ResponseWriter, r *http.Request) {

	render := marmoset.Render(w)
	ctx := middleware.Context(r)
	name := r.FormValue("name")
	key := path.Join("uploads", name)

	reader, err := storage.SharedInstance.NewReader(ctx, key)
	if err != nil {
		render.JSON(http.StatusBadRequest, marmoset.P{"message": err.Error()})
		return
	}
	defer reader.Close()

	w.Header().Set("Content-Type", reader.ContentType())
	b, err := ioutil.ReadAll(reader)
	if err != nil {
		render.JSON(http.StatusBadRequest, marmoset.P{"message": err.Error()})
		return
	}

	if _, err := w.Write(b); err != nil {
		render.JSON(http.StatusBadRequest, marmoset.P{"message": err.Error()})
		return
	}
}
