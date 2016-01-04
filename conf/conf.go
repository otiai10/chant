package conf

import (
	"encoding/json"
	"os"
	"path/filepath"

	"github.com/otiai10/curr"
	"github.com/revel/revel"
)

type configures struct {
	Whitelist    []string `json:"whitelist"`
	Blacklist    []string `json:"blacklist"`
	AllowDefault bool     `json:"allow_default"`
}

var configs = configures{
	Whitelist:    []string{},
	Blacklist:    []string{},
	AllowDefault: true,
}

func init() {
	if err := Load(); err != nil {
		revel.WARN.Println(err)
	}
}

// Load ...
func Load() error {
	f, err := os.Open(filepath.Join(curr.Dir(), "configs.json"))
	if err != nil {
		return err
	}
	if err := json.NewDecoder(f).Decode(&configs); err != nil {
		return err
	}
	return nil
}

// Reload ...
func Reload() error {
	return Load()
}

// Whitelist ...
func Whitelist(name string) bool {
	return inlist(configs.Whitelist, name)
}

// Blacklist ...
func Blacklist(name string) bool {
	return inlist(configs.Blacklist, name)
}

// AllowDefault ...
func AllowDefault() bool {
	return configs.AllowDefault
}

func inlist(list []string, name string) bool {
	for _, n := range list {
		if n == name {
			return true
		}
	}
	return false
}
