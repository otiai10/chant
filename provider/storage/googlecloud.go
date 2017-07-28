package storage

import (
	"golang.org/x/net/context"

	gcs "cloud.google.com/go/storage"

	"google.golang.org/appengine/file"
)

// GCSProvider ...
type GCSProvider struct {
}

// GCSObjectWriter ...
type GCSObjectWriter struct {
	*gcs.Writer
}

// ContentType ...
func (w *GCSObjectWriter) ContentType(contenttype string) {
	w.Writer.ContentType = contenttype
}

// GCSObjectReader ...
type GCSObjectReader struct {
	*gcs.Reader
}

// NewGCSProvider ...
func NewGCSProvider() *GCSProvider {
	return new(GCSProvider)
}

// NewReader ...
func (p *GCSProvider) NewReader(ctx context.Context, key string) (Reader, error) {
	bucketname, err := file.DefaultBucketName(ctx)
	if err != nil {
		return nil, err
	}
	client, err := gcs.NewClient(ctx)
	if err != nil {
		return nil, err
	}
	object := client.Bucket(bucketname).Object(key)
	reader, err := object.NewReader(ctx)
	if err != nil {
		return nil, err
	}
	return &GCSObjectReader{reader}, nil
}

// NewWriter ...
func (p *GCSProvider) NewWriter(ctx context.Context, key string) (Writer, error) {
	bucketname, err := file.DefaultBucketName(ctx)
	if err != nil {
		return nil, err
	}
	client, err := gcs.NewClient(ctx)
	if err != nil {
		return nil, err
	}
	object := client.Bucket(bucketname).Object(key)
	writer := object.NewWriter(ctx)
	return &GCSObjectWriter{writer}, nil
}
