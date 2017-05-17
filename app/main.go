package chant

import (
	"net/http"

	"github.com/otiai10/chant/server/controllers"

	"github.com/otiai10/marmoset"
)

func init() {

	marmoset.LoadViews("./views")

	router := marmoset.NewRouter()
	router.GET("/", controllers.Index)

	router.Static("/public", "./public")

	http.Handle("/", router)
}
