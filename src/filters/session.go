package filters

import (
	"net/http"

	m "github.com/otiai10/marmoset"
	"golang.org/x/net/context"
)

// SessionFilter ...
type SessionFilter struct {
	m.Filter
}

func (f *SessionFilter) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s, _ := r.Cookie("chant-sid")
	ctx := m.Context().Get(r)
	m.Context().Set(r, context.WithValue(ctx, "chant-sid", s.String()))

	defer func() {
		http.SetCookie(w, &http.Cookie{Name: "chant-sid", Value: "xxxxx"})
	}()

	f.Next.ServeHTTP(w, r)
}
