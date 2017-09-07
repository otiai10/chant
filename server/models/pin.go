package models

import (
	"os"
	"path"
	"strings"

	"context"

	"github.com/otiai10/chant/server/middleware"
	"github.com/otiai10/firebase"
)

// Pin represents pinned entry
type Pin struct {
	ID    string   `json:"id"`
	By    *User    `json:"by"`
	Entry *Message `json:"entry"`
}

// Pins fetches all pins
func Pins(ctx context.Context) (map[string]*Pin, error) {
	url := os.Getenv("FIREBASE_DB_URL") + path.Join("/pins")
	auth := os.Getenv("FIREBASE_DEPRECATED_DATABASE_SECRETS")
	ref := firebase.NewReference(url).Auth(auth)
	ref.Client = middleware.HTTPClient(ctx)

	pins := map[string]*Pin{}
	err := ref.Value(&pins)
	return pins, err
}

// HasQueries returns if this contains given queries
func (pin *Pin) HasQueries(queries []string) bool {
	if len(queries) == 0 {
		return true
	}
	for _, q := range queries {
		if strings.Index(pin.Entry.Text, q) >= 0 {
			return true
		}
	}
	return false
}
