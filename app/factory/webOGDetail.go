package factory

import (
    // "encoding/xml"
    // "fmt"
)

// ほんとはモデルに属するべき
type WebOGDetail struct {
    Title string
    Description string
    Image string
    PageContents string
}

/*
type HTMLResponse struct {
    XMLName xml.Name `xml:"html"`
    Head    string `xml:"head"`
    Body    string `xml:"body"`
}
*/

func CreateOGDetailFromResponse(xmlBytes []byte) (og WebOGDetail, err error) {
    /* {{{
    htmlRes := HTMLResponse{}
    e := xml.Unmarshal(xmlBytes, &htmlRes)
    if e != nil {
        panic(e)
    }
    fmt.Printf("%+v", htmlRes)
    }}} */
    // Unmarshalのエラーが解決できるまで文字列でやる
    htmlString := string(xmlBytes)
    og = WebOGDetail{
        Title: "",
        Description: "",
        Image: "",
        PageContents: htmlString,
    }
    return
}
