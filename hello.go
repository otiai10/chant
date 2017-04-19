package main

import (
	"fmt"
	"net/http"

	"github.com/otiai10/marmoset"
)

// func main() {
// 	log.Print("Listening on port 8080")
// 	log.Fatal(http.ListenAndServe(":8080", nil))
// }

func init() {
	router := marmoset.NewRouter()
	router.GET("/", handler)
	// http.HandleFunc("/", handler)
	http.HandleFunc("/_ah/health", healthCheckHandler)
}

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Hello, marmoset")
}

func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "ok")
}
