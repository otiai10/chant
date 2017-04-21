package main

import (
	"log"
	"net/http"

	"github.com/otiai10/chant/server/controllers"
	"github.com/otiai10/marmoset"
)

func main() {

	marmoset.LoadViews("/server/views")

	r := marmoset.NewRouter()
	r.GET("/", controllers.Index)
	r.GET("/_ah/health", controllers.HealthCheck)

	r.Static("/public", "/client/dest")

	log.Print("Listening on port 8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
