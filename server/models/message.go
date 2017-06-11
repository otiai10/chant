package models

import (
	"os"
	"path"
	"time"

	"golang.org/x/net/context"

	"github.com/otiai10/chant/server/middleware"
	"github.com/otiai10/firebase"
)

// Message ...
type Message struct {
	ID   string `json:"-"`
	Text string `json:"text"`
	Time int64  `json:"time"`
	User *User  `json:"user"`
}

// NewMessage ...
func NewMessage(text string, user *User) *Message {
	return &Message{
		Text: text,
		Time: time.Now().UnixNano() / (1000 * 1000),
		User: user,
	}
}

// Push ...
func (m *Message) Push(ctx context.Context) error {
	url := os.Getenv("FIREBASE_DB_URL") + path.Join("/messages")
	auth := os.Getenv("FIREBASE_DEPRECATED_DATABASE_SECRETS")
	ref := firebase.NewReference(url).Auth(auth)
	ref.Client = middleware.HTTPClient(ctx)
	return ref.Push(m)
}
