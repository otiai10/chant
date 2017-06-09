// +build !appengine

package middleware

import (
	"context"
	"net/http"
)

// Context ...
func Context(r *http.Request) context.Context {
	return context.Background()
}
