package chant

import (
	"fmt"
	"net/http"
	"os"

	"github.com/otiai10/chant/provider"
	"github.com/otiai10/chant/server/controllers"
	"github.com/otiai10/chant/server/filters"

	"github.com/otiai10/marmoset"
)

func init() {

	// Identity Provider
	if err := provider.Initialize("twitter"); err != nil {
		panic(fmt.Errorf("Failed to initialize identity provider: %v", err))
	}

	// Views
	if marmoset.LoadViews("./views") == nil {
		panic("Marmoset failed to load views")
	}

	// Routings
	router := marmoset.NewRouter()
	// app
	router.GET("/", controllers.Index)
	router.GET("/login", controllers.Login)
	router.POST("/logout", controllers.Logout)
	router.POST("/join", controllers.Join)
	router.POST("/leave", controllers.Leave)
	router.GET("/403", controllers.Forbidden)
	// auth
	router.POST("/auth", controllers.Auth)
	router.GET("/auth/callback", controllers.AuthCallback)
	// api
	router.GET("/api/tweets/embed", controllers.GetTweetEmbed)
	// static resources
	router.Static("/public", "./public")

	// Filters
	policyfile, _ := os.Open("./policy.yaml")
	server := marmoset.NewFilter(router).
		Add(filters.InitializeAuthFilter(policyfile)).
		Add(new(marmoset.ContextFilter)).
		Server()

	http.Handle("/", server)
}
