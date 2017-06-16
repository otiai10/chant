// +build !appengine

package middleware

import (
	"context"
	"net/http"
)

// HTTPClient ...
func HTTPClient(ctx context.Context) *http.Client {
	return http.DefaultClient
}
