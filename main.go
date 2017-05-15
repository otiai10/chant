package chant

import (
	"fmt"
	"net/http"
	"time"
	//"github.com/otiai10/marmoset"
)

func init() {
	// router := marmoset.NewRouter()
	// router.GET("/", handler)
	// http.Handle("/", router)
	http.HandleFunc("/", handler)
}

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, world!: %s", time.Now().String())
}
