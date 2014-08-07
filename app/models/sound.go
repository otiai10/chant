package model

import "regexp"

type Sound struct {
	Type      string
	Sharer    *User
	Source    SoundSource
	Timestamp int
}

type Vendor interface {
	GetHash(string) string
}

type SoundSource struct {
	Vendor Vendor
	Url    string
	Hash   string
}

type SoundCloud struct {
	Name string
}

func (sc SoundCloud) GetHash(url string) string {
	exp := regexp.MustCompile("\\/search\\/")
	if exp.MatchString(url) {
		return ""
	}
	return url
}

type YouTube struct {
	Name string
}

func (yt YouTube) GetHash(url string) string {
	exp, _ := regexp.Compile("(.+)/watch\\?.*v=([a-zA-Z0-9_-]+)")
	matched := exp.FindAllStringSubmatch(url, 3)
	return matched[0][2]
}

type UnknownVendor struct {
	Name string
}

func (uk UnknownVendor) GetHash(url string) string {
	return ""
}
