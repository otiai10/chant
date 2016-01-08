package bot

import (
	"chant/app/models"
	"fmt"

	"github.com/PuerkitoBio/goquery"
)

// LGTMHandler ...
type LGTMHandler struct {
	HandlerBase
}

// Handle ...
func (h LGTMHandler) Handle(event *models.Event, b *models.User) *models.Event {

	wg := delay()
	defer wg.Wait()

	doc, err := goquery.NewDocument("http://lgtm.in/g")
	if err != nil {
		return models.NewMessage(b, fmt.Sprintf("エラー: %v", err))
	}
	src, _ := doc.Find("div.thumbnail>a>img").First().Attr("src")

	return models.NewMessage(b, src)
}

// Help ...
func (h LGTMHandler) Help() string {
	return "Looks Good To Me"
}
