package app

import (
	"net/http"

	"github.com/otiai10/chant/src/routes"
	"github.com/otiai10/marmoset"
)

func init() {

	marmoset.LoadViews("../src/views")

	frontend := routes.Frontend()

	http.Handle("/", frontend)
}
