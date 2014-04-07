package factory

import "time"
import "chant/app/models"

import "regexp"

func StampFromText(text string) (stamp model.Stamp, err error) {
	exp, _ := regexp.Compile("^{@stamp:([^}]+)}$")
	matched := exp.FindAllStringSubmatch(text, 1)
	if len(matched) == 0 || len(matched[0]) < 2 {
		err = NotStampError{"スタンプフォーマットちがう！"}
		return
	}
	stamp = model.Stamp{
		"stamp",
		matched[0][1],
		matched[0][0],
		int(time.Now().Unix()),
	}
	return
}

type NotStampError struct {
	message string
}

func (nse NotStampError) Error() string {
	return nse.message
}
