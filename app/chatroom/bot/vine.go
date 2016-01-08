package bot

import (
	"chant/app/models"
	"encoding/json"
	"fmt"
	"math/rand"
	"time"

	"github.com/otiai10/cachely"
)

// VineHandler ...
type VineHandler struct {
	HandlerBase
}

// Handle ...
func (h VineHandler) Handle(event *models.Event, b *models.User) *models.Event {

	wg := delay()
	defer wg.Wait()

	q := h.ReplaceAllString(event.Raw, "")
	baseURL := "https://api.vineapp.com/posts/search/%s?count=10"
	res, err := cachely.Get(fmt.Sprintf(baseURL, q))

	if err != nil {
		return models.NewMessage(b, fmt.Sprintf("しっぱいした: %v", err))
	}
	defer res.Body.Close()

	data := new(struct {
		Code string `json:"code"`
		Data struct {
			Records []struct {
				ShareURL string `json:"shareUrl"`
			} `json:"records"`
		} `json:"data"`
	})

	if err := json.NewDecoder(res.Body).Decode(data); err != nil || len(data.Data.Records) == 0 {
		return models.NewMessage(b, fmt.Sprintf("しっぱいした: %v", err))
	}
	records := data.Data.Records
	rand.Seed(time.Now().Unix())
	return models.NewMessage(b, records[rand.Intn(len(records))].ShareURL)
}

// Help ...
func (h VineHandler) Help() string {
	return "vineを検索してくるやつ"
}
