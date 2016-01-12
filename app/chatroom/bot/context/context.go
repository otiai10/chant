package context

import (
	"chant/app/models"
	"container/list"
)

const (
	limit = 10
)

var (
	ctx = map[string]*Context{
		"default": &Context{
			limit: limit,
			pool:  list.New(),
		},
	}
)

// Matcher ハンドラとかとるかんじでいいや
type Matcher interface {
	Match(*models.Event) bool
}

// Context とりあえずここでいいや
type Context struct {
	limit int
	pool  *list.List
}

// Default ...
func Default() *Context {
	return ctx["default"]
}

// Push ...
func (ctx *Context) Push(event *models.Event) error {
	ctx.pool.PushBack(event)
	if ctx.pool.Len() > ctx.limit {
		ctx.pool.Remove(ctx.pool.Front())
	}
	return nil
}

// Straight 直近何回連続でmatcherがMatchするか返す
func (ctx *Context) Straight(matcher Matcher, i int, el *list.Element) int {
	if ctx.pool.Len() == 0 {
		return 0
	}
	if el == nil {
		el = ctx.pool.Back()
	}
	if !matcher.Match(el.Value.(*models.Event)) {
		return i
	}
	i++
	if el.Prev() == nil {
		return i
	}
	return ctx.Straight(matcher, i, el.Prev())
}
