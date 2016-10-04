package app

import (
	"net/http"

	c "github.com/otiai10/chant/src/controllers"
	f "github.com/otiai10/chant/src/filters"
	m "github.com/otiai10/marmoset"
)

func init() {

	router := m.NewRouter()

	m.LoadViews("./views")

	router.GET("/", c.Index)
	router.GET("/login", c.Login)
	router.GET("/auth/twitter", c.AuthTwitterStart)
	router.GET("/auth/twitter/callback", c.AuthTwitterCallback)
	router.POST("/message", c.Message)

	server := m.NewFilter(router).
		Add(&f.AuthFilter{}).
		Add(&m.ContextFilter{}).
		Add(&f.RecoverFilter{}).
		Server()

	http.Handle("/", server)
}
