package controllers

import (
	"encoding/json"
	"net/http"
	"net/url"

	"github.com/otiai10/chant/server/middleware"
	"github.com/otiai10/chant/server/models"
	"github.com/otiai10/marmoset"
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
