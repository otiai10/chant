// This package is an entrypoint by which you can start chant application
// in **NO APPENGINE CONTEXT**, maybe under Go1.8
package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"

	yaml "gopkg.in/yaml.v2"

	_ "github.com/otiai10/chant/app"
	"github.com/otiai10/chant/provider"
	"github.com/otiai10/curr"
)

var (
	secretpath *string
	port       *int
)

func init() {
	secretpath = flag.String("secret", path.Join(curr.Dir(), "app/secret.yaml"), "Secret Env Variables")
	port = flag.Int("port", 8080, "Port Number to Listen")
	flag.Parse()
}

func main() {

	s := getSecret()
	for name, value := range s.Envs {
		if err := os.Setenv(name, value); err != nil {
			panic(err)
		}
	}

	if err := provider.Initialize("twitter"); err != nil {
		panic(fmt.Errorf("Failed to initialize identity provider: %v", err))
	}

	p := fmt.Sprintf(":%d", *port)
	log.Printf("[chant] Server listening port %s", p)
	if err := http.ListenAndServe(p, nil); err != nil {
		panic(err)
	}
}

// Secret ...
type Secret struct {
	Envs map[string]string `yaml:"env_variables"`
}

func getSecret() *Secret {
	s := &Secret{Envs: map[string]string{}}
	f, err := os.Open(*secretpath)
	if err != nil {
		panic(err)
	}
	log.Printf("[chant] Secret file `%s` found.\n", *secretpath)
	defer f.Close()
	b, err := ioutil.ReadAll(f)
	if err != nil {
		panic(err)
	}
	if err := yaml.Unmarshal(b, s); err != nil {
		panic(err)
	}
	return s
}
