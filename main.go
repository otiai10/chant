package chant

import (
	"fmt"
	"net/http"
	"time"

	"github.com/otiai10/marmoset"
)

func init() {
	router := marmoset.NewRouter()
	router.GET("/", handler)
	http.Handle("/", router)
}

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Using marmoset router!: %s", time.Now().String())
}
