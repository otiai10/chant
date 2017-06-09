// +build !appengine

package middleware

import (
	"context"
	"fmt"
)

// Logger ...
type Logger struct {
}

// Debugf ...
func (l *Logger) Debugf(format string, args ...interface{}) {
	fmt.Printf(format+"\n", args...)
}

// Log ...
func Log(ctx context.Context) *Logger {
	return new(Logger)
}
