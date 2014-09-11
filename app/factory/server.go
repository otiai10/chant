package factory

import "github.com/revel/revel"
import "chant/app/models"

func ServerFromConf(conf *revel.MergedConfig) (server model.Server) {
	host, _ := conf.String("http.host")
	port, _ := conf.String("http.port")
	server.Host = host
	server.Port = port
	api := ""
	if dev, ok := conf.Bool("mode.dev"); ok && dev {
		api = host + ":" + port
	} else {
		api = host
	}
	server.Domains = map[string]string{
		"api": api,
	}
	return
}
