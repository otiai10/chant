package controllers

import (
	"chant/app/factory"
	"chant/app/infrastructure"
	"fmt"
	"github.com/revel/revel"
)

type Preview struct {
	*revel.Controller
}

type WebOGDetail struct {
	Title       string
	Description string
	Image       string
}

// さいしょのページレンダリングだけー
func (c Preview) Index(url string) revel.Result {
	// TODO?: session check
	// fmt.Println(url)
	client := &infrastructure.MyHttpClient{}
	og, e := factory.CreateOGDetailFromResponse(client.Request(url))
	if e != nil {
		revel.ERROR.Println(e)
	}
	return c.RenderJson(og)
}
