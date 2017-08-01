package storage

import "golang.org/x/net/context"

// Provider ...
type Provider interface {
	NewWriter(ctx context.Context, key string) (Writer, error)
	NewReader(ctx context.Context, key string) (Reader, error)
}

// Writer ...
type Writer interface {
	Write([]byte) (int, error)
	ContentType(string)
	Close() error
}

// Reader ...
type Reader interface {
	Read([]byte) (int, error)
	ContentType() string
	Close() error
}

// SharedInstance ...
var SharedInstance Provider

// Initialize ...
func Initialize(name string) error {
	switch name {
	case "gcs":
		fallthrough
	default:
		SharedInstance = NewGCSProvider()
	}
	return nil
}
