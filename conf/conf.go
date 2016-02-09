package conf

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"

	"github.com/otiai10/curr"
	"github.com/revel/revel"
)

const (
	configfile = "configs.json"
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

// Load 設定ファイルを読み込んでメモリに載せる
func Load() error {
	f, err := os.Open(filepath.Join(curr.Dir(), configfile))
	if err != nil {
		return err
	}
	if err := json.NewDecoder(f).Decode(&configs); err != nil {
		return err
	}
	return nil
}

// Apply メモリに載ってる設定structをファイルに書き出す
func Apply() error {
	fname := filepath.Join(curr.Dir(), configfile)
	if _, err := os.Stat(fname); err != nil {
		os.Create(fname)
	}

	b, err := json.MarshalIndent(configs, "", "    ")
	if err != nil {
		return fmt.Errorf("marshal: %v", err)
	}
	if err := ioutil.WriteFile(fname, b, os.ModePerm); err != nil {
		return fmt.Errorf("write: %v", err)
	}
	return nil
}

// Kick ...
func Kick(name string) error {
	if name == "default" {
		configs.AllowDefault = false
		return Apply()
	}
	configs.Whitelist = removefromlist(configs.Whitelist, name)
	configs.Blacklist = removefromlist(configs.Blacklist, name)
	configs.Blacklist = append(configs.Blacklist, name)
	return Apply()
}

// Invite ...
func Invite(name string) error {
	if name == "default" {
		configs.AllowDefault = true
		return Apply()
	}
	configs.Whitelist = removefromlist(configs.Whitelist, name)
	configs.Blacklist = removefromlist(configs.Blacklist, name)
	configs.Whitelist = append(configs.Whitelist, name)
	return Apply()
}

// Reload ...
func Reload() error {
	return Load()
}

// Whitelist ...
func Whitelist() []string {
	return configs.Whitelist
}

// InWhitelist ...
func InWhitelist(name string) bool {
	return inlist(configs.Whitelist, name)
}

// Blacklist ...
func Blacklist() []string {
	return configs.Blacklist
}

// InBlacklist ...
func InBlacklist(name string) bool {
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

func removefromlist(list []string, name string) []string {
	newlist := []string{}
	for _, v := range list {
		if v != name {
			newlist = append(newlist, v)
		}
	}
	return newlist
}
