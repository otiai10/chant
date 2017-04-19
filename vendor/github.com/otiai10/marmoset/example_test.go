// +build !appengine

package marmoset

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strconv"
)

type User struct {
	ID int `json:"id"`
}

// UserFilter can detect request header and define current request user.
// For example, you can restore User model from auth-token in request header.
type UserFilter struct {
	Filter
}

// ServeHTTP will be called before the root router's ServeHTTP.
func (f *UserFilter) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx := Context().Get(r)
	id, err := strconv.Atoi(r.Header.Get("X-User-ID"))
	if err != nil {
		w.WriteHeader(400)
		return
	}
	Context().Set(context.WithValue(ctx, "user", User{id}), r)
	f.Next.ServeHTTP(w, r)
}

var SampleController = func(w http.ResponseWriter, r *http.Request) {
	user := Context().Get(r).Value("user").(User)
	json.NewEncoder(w).Encode(map[string]interface{}{"request_user": user})
}

func ExampleFilter() {

	// Define routings.
	router := NewRouter()
	router.GET("/test", SampleController)

	// Add Filters.
	// If you want to use `Context`, `ContextFilter` must be added for the last.
	// Remember "Last added, First called"
	filtered := NewFilter(router).Add(&UserFilter{}).Add(&ContextFilter{}).Server()

	// Use `http.ListenAndServe` in real case, instead of httptest.
	ts := httptest.NewServer(filtered)

	req, _ := http.NewRequest("GET", ts.URL+"/test", nil)
	req.Header.Add("X-User-ID", "1001")
	res, _ := http.DefaultClient.Do(req)
	fmt.Println("StatusCode:", res.StatusCode)

	req, _ = http.NewRequest("GET", ts.URL+"/test", nil)
	req.Header.Add("X-User-ID", "xxxxxxxx")
	res, _ = http.DefaultClient.Do(req)
	fmt.Println("StatusCode:", res.StatusCode)

	// Output:
	// StatusCode: 200
	// StatusCode: 400
}
