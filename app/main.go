package app

import (
	"net/http"

	"github.com/otiai10/marmoset"
)

func init() {
	router := marmoset.NewRouter()
	http.Handle("/", router)
}
