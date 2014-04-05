package infrastructure

import (
    "io/ioutil"
    "net/http"
)
type MyHttpClient struct {
}

func (c *MyHttpClient)Request(url string) (xml []byte) {
    httpResponse, e := http.Get(url)
    if e != nil {
        panic(e)
    }
    xml, e = ioutil.ReadAll(httpResponse.Body)
    if e != nil {
        panic(e)
    }
    httpResponse.Body.Close()
    return xml
}
