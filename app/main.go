package app

import (
	"net/http"

	"github.com/otiai10/chant/server/routes"
	"github.com/otiai10/marmoset"
)

func init() {

	marmoset.LoadViews("../server/views")

	frontend := routes.Frontend()

	http.Handle("/", frontend)
}
