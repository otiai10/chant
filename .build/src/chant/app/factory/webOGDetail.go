package factory

// WebOGDetail ...
type WebOGDetail struct {
	Title        string
	Description  string
	Image        string
	PageContents string
}

// CreateOGDetailFromResponse ...
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
