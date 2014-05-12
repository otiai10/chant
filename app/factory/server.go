package factory

import "github.com/revel/revel"
import "chant/app/models"

func ServerFromConf(conf *revel.MergedConfig) model.Server {
	host, _ := conf.String("http.host")
	port, _ := conf.String("http.port")
	return model.Server{
		Host: host,
		Port: port,
	}
}
