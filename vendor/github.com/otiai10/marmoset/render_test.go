package marmoset

import (
	"net/http/httptest"
	"testing"

	. "github.com/otiai10/mint"
)

func TestRender(t *testing.T) {
	w := httptest.NewRecorder()
	renderer := Render(w, true)
	_, ok := renderer.(Renderer)
	Expect(t, ok).ToBe(true)
}
