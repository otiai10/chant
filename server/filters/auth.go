package filters

import (
	"net/http"
	"os"

	"golang.org/x/net/context"

	"github.com/otiai10/chant/server/middleware"
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
	ctx := middleware.Context(r)
	marmoset.Context().Set(r, context.WithValue(ctx, AuthKey, user))
	f.Next.ServeHTTP(w, r)
	return

}

// RequestUser returns context user which auth filter detected and has set
func RequestUser(r *http.Request) *models.User {
	user, ok := marmoset.Context().Get(r).Value(AuthKey).(*models.User)
	if !ok {
		return nil
	}
	return user
}
