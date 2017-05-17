package chant

import (
	"net/http"

	"github.com/otiai10/chant/server/controllers"
	"github.com/otiai10/chant/server/filters"

	"github.com/otiai10/marmoset"
)

func init() {

	marmoset.LoadViews("./views")

	router := marmoset.NewRouter()
	router.GET("/", controllers.Index)
	router.GET("/login", controllers.Login)

	router.Static("/public", "./public")

	server := marmoset.NewFilter(router).Add(new(filters.AuthFilter)).Server()

	http.Handle("/", server)
}
