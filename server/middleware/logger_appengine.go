// +build appengine

package middleware

import (
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
)

// Logger ...
type Logger struct {
	ctx context.Context
}

// Debugf ...
func (l *Logger) Debugf(format string, args ...interface{}) {
	log.Debugf(l.ctx, format, args...)
}

// Log ...
func Log(ctx context.Context) *Logger {
	return &Logger{ctx}
}
