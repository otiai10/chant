package message

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"os"
	"path/filepath"
	"time"
)

const (
	defaultLanguage = "ja"
	undefined       = "undefined"
)

// Messages ...
type Messages map[string]map[string]formats

// Get ...
func (m Messages) Get(key string) string {
	lang := defaultLanguage // TODO
	fmts, ok := m[lang][key]
	if !ok || len(fmts) == 0 {
		return undefined
	}
	rand.Seed(time.Now().Unix())
	return fmts[rand.Intn(len(fmts))]
}

// Format ...
func (m Messages) Format(key string, v ...interface{}) string {
	return fmt.Sprintf(m.Get(key), v...)
}

type formats []string

// LoadDir ...
func LoadDir(dirpath string) (Messages, error) {
	dest := Messages{}
	filenames, err := filepath.Glob(filepath.Join(dirpath, "*.json"))
	if err != nil {
		return nil, onError("glob", err)
	}
	for _, f := range filenames {
		b := filepath.Base(f)
		lang := b[0 : len(b)-len(filepath.Ext(b))]
		if _, ok := dest[lang]; !ok {
			dest[lang] = map[string]formats{}
		}
		file, err := os.Open(f)
		if err != nil {
			return nil, onError("open", err)
		}
		defer file.Close()

		tmp := map[string]formats{}
		if err := json.NewDecoder(file).Decode(&tmp); err != nil {
			return nil, onError("decode", err)
		}
		for k, v := range tmp {
			dest[lang][k] = v
		}
	}

	return dest, nil
}

func onError(tag string, err error) error {
	return fmt.Errorf(`message: %s: %v`, tag, err)
}
