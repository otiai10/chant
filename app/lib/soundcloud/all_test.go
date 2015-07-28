package soundcloud

import (
	"encoding/json"
	"net/http"
	"testing"

	. "github.com/otiai10/mint"
)

func TestClient_Get(t *testing.T) {
	client := &Client{
		ID: "3f4831d902a9686ec6293ed8dd547cd5",
	}
	res, err := client.Get("/tracks", nil)
	Expect(t, err).ToBe(nil)
	Expect(t, res.StatusCode).ToBe(http.StatusOK)
	body := []struct {
		DownloadURL  string `json:"download_url"`
		PermalinkURL string `json:"permalink_url"`
	}{}
	err = json.NewDecoder(res.Body).Decode(&body)
	Expect(t, err).ToBe(nil)
}

func TestClient_SearchTracks(t *testing.T) {
	client := &Client{
		ID: "3f4831d902a9686ec6293ed8dd547cd5",
	}
	tracks, err := client.SearchTracks("claris")
	Expect(t, err).ToBe(nil)
	Expect(t, len(tracks)).ToBe(9)
}
