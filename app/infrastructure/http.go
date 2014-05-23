package infrastructure

import (
	"github.com/revel/revel"
	"io/ioutil"
	"net/http"
)

type MyHttpClient struct {
}

func (c *MyHttpClient) Request(url string) (xml []byte) {
	httpResponse, e := http.Get(url)
	if e != nil {
		revel.ERROR.Println(e)
	}
	xml, e = ioutil.ReadAll(httpResponse.Body)
	if e != nil {
		revel.ERROR.Println(e)
	}
	httpResponse.Body.Close()
	return xml
}
