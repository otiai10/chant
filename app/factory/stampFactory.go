package factory

import "time"
import "chant/app/models"

import "regexp"
import "strings"

func StampFromText(text string) (stamp model.Stamp, err error) {
	exp, _ := regexp.Compile("^{@stamp:([^}]+)}$")
	matched := exp.FindAllStringSubmatch(text, 1)
	if len(matched) == 0 || len(matched[0]) < 2 {
		err = NotStampError{"スタンプフォーマットちがう！"}
		return
	}
	used := false
	if isUsed, _ := regexp.MatchString("(.+)@use$", matched[0][1]); isUsed {
		used = true
		matched[0][1] = strings.Replace(matched[0][1], "@use", "", 1)
	}
	stamp = model.Stamp{
		"stamp",
		matched[0][1],
		matched[0][0],
		int(time.Now().Unix()),
		used,
	}
	return
}

type NotStampError struct {
	message string
}

func (nse NotStampError) Error() string {
	return nse.message
}
