package filters

import "net/http"

// AuthFilter ...
type AuthFilter struct {
	Next http.Handler
}

// ServeHTTP ...
func (f *AuthFilter) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	// TODO: Refactor marmoset.Filter
	switch r.URL.Path {
	case "/":
		http.Redirect(w, r, "/login", http.StatusTemporaryRedirect)
	case "/login":
		f.Next.ServeHTTP(w, r)
	default:
		f.Next.ServeHTTP(w, r)
	}

}
