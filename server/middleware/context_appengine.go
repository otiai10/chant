// +build appengine

package middleware

import (
	"net/http"

	"google.golang.org/appengine"

	"golang.org/x/net/context"
)

// Context ...
func Context(r *http.Request) context.Context {
	return appengine.NewContext(r)
}
