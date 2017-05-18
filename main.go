// This package is an entrypoint by which you can start chant application
// in **NO APPENGINE CONTEXT**, maybe under Go1.8
// TODO: but, for now, it's not working.
// I should separate build flag for appengine packages.
package main

import (
	"log"
	"net/http"

	_ "github.com/otiai10/chant/app"
)

func main() {
	port := ":8080"
	log.Printf("Server listening port %s", port)
	http.ListenAndServe(port, nil)
}
