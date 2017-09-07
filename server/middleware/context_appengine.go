// +build appengine

package middleware

import (
	"net/http"

	"google.golang.org/appengine"

	"context"
)

// Context ...
func Context(r *http.Request) context.Context {
	return appengine.NewContext(r)
}
