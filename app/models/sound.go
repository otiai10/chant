package models

import "regexp"

// Sound ...
type Sound struct {
	Type      string
	Sharer    *User
	Source    SoundSource
	Timestamp int
}

// Vendor ...
type Vendor interface {
	GetHash(string) string
}

// SoundSource ...
type SoundSource struct {
	Vendor Vendor
	URL    string
	Hash   string
}

// SoundCloud ...
type SoundCloud struct {
	Name string
}

// GetHash ...
func (sc SoundCloud) GetHash(url string) string {
	exp := regexp.MustCompile("\\/search\\/")
	if exp.MatchString(url) {
		return ""
	}
	return url
}

// YouTube ...
type YouTube struct {
	Name string
}

// GetHash ...
func (yt YouTube) GetHash(url string) string {
	exp, _ := regexp.Compile("(.+)/watch\\?.*v=([a-zA-Z0-9_-]+)")
	matched := exp.FindAllStringSubmatch(url, 3)
	return matched[0][2]
}

// UnknownVendor ...
type UnknownVendor struct {
	Name string
}

// GetHash ...
func (uk UnknownVendor) GetHash(url string) string {
	return ""
}
