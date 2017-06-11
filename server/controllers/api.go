package controllers

import (
	"encoding/json"
	"net/http"
	"net/url"

	"github.com/otiai10/chant/server/filters"
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
