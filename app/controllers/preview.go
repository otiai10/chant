package controllers

import (
	"chant/app/factory"
	"chant/app/infrastructure"

	"github.com/revel/revel"
)

// Preview ...
type Preview struct {
	*revel.Controller
}

// Index ...
func (c Preview) Index(url string) revel.Result {
	// TODO?: session check
	// fmt.Println(url)
	client := &infrastructure.MyHTTPClient{}
	og, e := factory.CreateOGDetailFromResponse(client.Request(url))
	if e != nil {
		revel.ERROR.Println(e)
	}
	return c.RenderJson(og)
}
