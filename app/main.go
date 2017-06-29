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

	unauthorized := marmoset.NewRouter()
	unauthorized.GET("/login", controllers.Login)
	unauthorized.GET("/403", controllers.Forbidden)
	unauthorized.POST("/auth", controllers.Auth)
	unauthorized.GET("/auth/callback", controllers.AuthCallback)
	unauthorized.GET("/sw.js", controllers.ServiceWorkerJavaScript)
	unauthorized.GET("/manifest.json", controllers.ManifestJSON)
	root.Subrouter(unauthorized)

	auth := filters.InitializeAuthFilter(policyfile)
	authorized := marmoset.NewRouter()
	authorized.GET("/", controllers.Index)
	authorized.POST("/logout", controllers.Logout)
	authorized.GET("/api/tweets/embed", controllers.GetTweetEmbed)
	authorized.GET("/api/messages/embed", controllers.GetURLEmbed)
	authorized.POST("/api/messages/(?P<id>[a-zA-Z0-9-_]+)/totsuzenize", controllers.Totsuzenize)
	authorized.POST("/api/messages/notification", controllers.MessageNotification)
	authorized.Apply(new(marmoset.ContextFilter), auth)
	root.Subrouter(authorized)

	// static resources
	root.Static("/public", "./public")

	http.Handle("/", root)
}
