package filters

import (
	"net/http"
	"os"

	"golang.org/x/net/context"
	"google.golang.org/appengine"

	"github.com/otiai10/chant/server/models"
	"github.com/otiai10/marmoset"
)

// AuthFilter ...
type AuthFilter struct {
	Next   http.Handler
	Policy *Policy
}

// AuthCtxKey ...
type AuthCtxKey string

// AuthKey ...
const AuthKey AuthCtxKey = "user"

// InitializeAuthFilter ...
func InitializeAuthFilter(policyfile *os.File) *AuthFilter {
	return &AuthFilter{
		Policy: NewPolicy(policyfile),
	}
}

// ServeHTTP ...
func (f *AuthFilter) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	// TODO: Refactor marmoset.Filter to attach filter with ONLY specific routings

	switch r.URL.Path {
	case "/login":
		f.Next.ServeHTTP(w, r)
	case "/":
		c, err := r.Cookie("chant_identity_token")
		if err != nil {
			http.Redirect(w, r, "/login", http.StatusTemporaryRedirect)
			return
		}
		user, err := models.DecodeUser(c.Value, os.Getenv("JWT_SALT"))
		if err != nil {
			http.Redirect(w, r, "/login", http.StatusTemporaryRedirect)
			return
		}
		if user == nil {
			http.Redirect(w, r, "/login", http.StatusTemporaryRedirect)
			return
		}
		if !f.Policy.Allow(user) {
			http.Redirect(w, r, "/403", http.StatusTemporaryRedirect)
			return
		}
		ctx := appengine.NewContext(r)
		marmoset.Context().Set(r, context.WithValue(ctx, AuthKey, user))
		f.Next.ServeHTTP(w, r)
		return
	default:
		f.Next.ServeHTTP(w, r)
	}

}
