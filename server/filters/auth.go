package filters

import "net/http"

// AuthFilter ...
type AuthFilter struct {
	Next http.Handler
}

func (f *AuthFilter) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/login" {
		f.Next.ServeHTTP(w, r)
		return
	}
	http.Redirect(w, r, "/login", http.StatusTemporaryRedirect)
	// f.Next.ServeHTTP(w, r)
}
