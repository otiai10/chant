package factory

import (
// "encoding/xml"
// "fmt"
)

// ほんとはモデルに属するべき
type WebOGDetail struct {
	Title        string
	Description  string
	Image        string
	PageContents string
}

func CreateOGDetailFromResponse(xmlBytes []byte) (og WebOGDetail, err error) {
	htmlString := string(xmlBytes)
	og = WebOGDetail{
		Title:        "",
		Description:  "",
		Image:        "",
		PageContents: htmlString,
	}
	return
}
