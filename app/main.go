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

	policyfile, _ := os.Open("./policy.yaml")

	// Routings
	root := marmoset.NewRouter()

	authorized := marmoset.NewRouter()
	authorized.GET("/", controllers.Index)
	authorized.POST("/logout", controllers.Logout)
	authorized.POST("/join", controllers.Join)
	authorized.POST("/leave", controllers.Leave)
	authorized.GET("/api/tweets/embed", controllers.GetTweetEmbed)
	authorized.POST("/api/messages/(?P<id>[a-zA-Z0-9-_]+)/totsuzenize", controllers.Totsuzenize)
	root.Subrouter(
		marmoset.NewFilter(authorized).
			Add(filters.InitializeAuthFilter(policyfile)).
			Add(new(marmoset.ContextFilter)).Router(),
	)

	unauthorized := marmoset.NewRouter()
	unauthorized.GET("/login", controllers.Login)
	unauthorized.GET("/403", controllers.Forbidden)
	unauthorized.POST("/auth", controllers.Auth)
	unauthorized.GET("/auth/callback", controllers.AuthCallback)
	root.Subrouter(
		marmoset.NewFilter(unauthorized).Add(new(marmoset.ContextFilter)).Router(),
	)

	// static resources
	root.Static("/public", "./public")

	http.Handle("/", root)
}
