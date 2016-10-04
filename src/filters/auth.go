package filters

import (
	"net/http"

	"golang.org/x/net/context"

	"github.com/otiai10/chant/src/configs"
	"github.com/otiai10/chant/src/lib/jwtoken"
	"github.com/otiai10/chant/src/models"
	m "github.com/otiai10/marmoset"
)

// AuthFilter ...
type AuthFilter struct {
	m.Filter
}

var skips = map[string]interface{}{
	"/login":                 true,
	"/auth/twitter":          true,
	"/auth/twitter/callback": true,
}

func (f *AuthFilter) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	if _, ok := skips[r.URL.Path]; ok {
		f.Next.ServeHTTP(w, r)
		return
	}

	cookie, err := r.Cookie(jwtoken.CookieName)

	if err != nil {
		http.Redirect(w, r, "/login", http.StatusTemporaryRedirect)
		return
	}

	user := new(models.User)
	if err = jwtoken.New(configs.JWTSecretSalt(), configs.JWTSigningMethod()).Decode(cookie.Value, user); err != nil {
		http.Redirect(w, r, "/login", http.StatusTemporaryRedirect)
		return
	}

	// Set this user as a context.
	ctx := m.Context().Get(r)
	m.Context().Set(r, context.WithValue(ctx, "current_user", user))

	f.Next.ServeHTTP(w, r)
}
