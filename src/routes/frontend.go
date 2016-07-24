package routes

import (
	"github.com/otiai10/chant/src/controllers"
	"github.com/otiai10/marmoset"
)

// Frontend ...
func Frontend() *marmoset.Router {
	router := marmoset.NewRouter()
	router.GET("/", controllers.Index)
	router.Static("/public", "../assets")
	return router
}
