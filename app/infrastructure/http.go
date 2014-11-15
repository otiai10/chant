package infrastructure

import (
	"io/ioutil"
	"net/http"

	"github.com/revel/revel"
)

// MyHTTPClient ...
type MyHTTPClient struct {
}

// Request ...
func (c *MyHTTPClient) Request(url string) (xml []byte) {
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
