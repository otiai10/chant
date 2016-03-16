package bot

import (
	"chant/app/models"
	"container/list"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/otiai10/ternary"
)

// TimezoneHandler ...
type TimezoneHandler struct {
	HandlerBase
}

// Handle ...
func (h TimezoneHandler) Handle(event *models.Event, b *models.User, members *list.List) *models.Event {

	wg := delay()

	names := []string{}
	if m := h.FindAllStringSubmatch(event.Raw, -1); len(m) != 0 && len(m[0]) > 1 {
		for _, name := range strings.Split(m[0][1], " ") {
			if len(name) != 0 {
				names = append(names, name)
			}
		}
	}

	res := []string{}
	now := time.Now().UTC()
	for e := members.Front(); e != nil; e = e.Next() {
		user := e.Value.(*models.User)
		if len(names) != 0 && !inArray(user.ScreenName, names) {
			continue
		}
		m := regex("GMT([+-])(0?[1-9]{1,2})([0-9]{2}) .+").FindAllStringSubmatch(user.Timezone, -1)
		if len(m) == 0 || len(m[0]) < 3 {
			res = append(res, fmt.Sprintf("%s  <%s>  %s", user.ScreenName, "Unknown(UTC)", now.Format("15:04")))
			continue
		}
		o := ternary.If(m[0][1] == "+").Int(1, -1)
		hours, _ := strconv.Atoi(m[0][2])
		t := now.Add(time.Duration(o*hours) * time.Hour)
		if m[0][3] != "00" {
			minutes, _ := strconv.Atoi(m[0][3])
			t = t.Add(time.Duration(o*minutes) * time.Minute)
		}
		res = append(res, fmt.Sprintf("%s  <%s>  %s", user.ScreenName, user.Timezone, t.Format("15:04")))
	}

	wg.Wait()

	if len(res) == 0 {
		return models.NewMessage(b, fmt.Sprintf("%s is だれ", names[0]))
	}
	return models.NewMessage(b, strings.Join(res, "\n"))
}

// Help ...
func (h TimezoneHandler) Help() string {
	return "時間をアレします /tz {なまえ} もできる"
}

func inArray(t string, arr []string) bool {
	for _, el := range arr {
		if t == el {
			return true
		}
	}
	return false
}
