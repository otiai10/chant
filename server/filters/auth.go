package filters

import (
	"net/http"
	"os"

	"github.com/otiai10/chant/server/models"
)

// AuthFilter ...
type AuthFilter struct {
	Next http.Handler
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
		if user != nil {
			f.Next.ServeHTTP(w, r)
			return
		}
		http.Redirect(w, r, "/login", http.StatusTemporaryRedirect)
	default:
		f.Next.ServeHTTP(w, r)
	}

}
