package filters

import (
	"net/http"

	m "github.com/otiai10/marmoset"
)

// RecoverFilter ...
type RecoverFilter struct {
	m.Filter
}

func (f *RecoverFilter) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	defer func() {
		if err := recover(); err != nil {
			m.Render(w).HTML("errors/500", m.P{
				"errors": []interface{}{map[string]interface{}{"message": err}},
			})
		}
	}()
	f.Next.ServeHTTP(w, r)
}
