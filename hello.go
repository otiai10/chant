package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/otiai10/marmoset"
)

func main() {

	r := marmoset.NewRouter()

	r.GET("/", handle)
	r.GET("/chant", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "CHANT: %s", "ちゃんとしよう")
	})
	r.GET("/_ah/health", healthCheckHandler)

	r.Static("/public", "/client/dest")

	log.Print("Listening on port 8080")

	log.Fatal(http.ListenAndServe(":8080", r))
}

func handle(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	fmt.Fprint(w, "Hello world!")
}

func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "ok")
}
