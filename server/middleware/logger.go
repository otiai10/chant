// +build !appengine

package middleware

import (
	"context"
	"log"
)

// Logger ...
type Logger struct {
}

// Debugf ...
func (l *Logger) Debugf(format string, args ...interface{}) {
	log.Printf(format+"\n", args...)
}

// Log ...
func Log(ctx context.Context) *Logger {
	return new(Logger)
}
