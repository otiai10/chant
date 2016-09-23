package app

import (
	"net/http"

	c "github.com/otiai10/chant/src/controllers"
	f "github.com/otiai10/chant/src/filters"
	m "github.com/otiai10/marmoset"
)

func init() {
	router := m.NewRouter()

	m.LoadViews("../src/views")

	router.GET("/", c.Index)
	router.POST("/hello", c.Hello)

	server := m.NewFilter(router).
		Add(&f.SessionFilter{}).
		Add(&m.ContextFilter{}).
		Add(&f.RecoverFilter{}).
		Server()

	http.Handle("/", server)
}
