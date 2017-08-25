// +build appengine

package middleware

import (
	"net/http"

	"google.golang.org/appengine/urlfetch"

	"context"
)

// HTTPClient ...
func HTTPClient(ctx context.Context) *http.Client {
	return urlfetch.Client(ctx)
}
