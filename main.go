package chant

import (
	"net/http"

	m "github.com/otiai10/marmoset"
)

func init() {
	router := m.NewRouter()

	m.LoadViews("views")

	router.GET("/", func(w http.ResponseWriter, r *http.Request) {
		m.Render(w).HTML("index", m.P{})
	})

	http.Handle("/", router)
}
