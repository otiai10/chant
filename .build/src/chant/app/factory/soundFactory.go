package factory

import (
	"chant/app/models"
	"fmt"
	"regexp"
	"time"
)

// SoundFromText ...
func SoundFromText(text string, user *models.User) (sound models.Sound, err error) {
	exp, _ := regexp.Compile("^(https?)://(soundcloud.com|www.youtube.com)/(.+)")
	matched := exp.FindAllStringSubmatch(text, 1)
	if len(matched) == 0 || len(matched[0]) < 4 {
		err = NotSoundError{"ようつべとサンクラじゃない"}
		return
	}
	source, err := soundSourceFromMatchedMap(matched[0])
	if err != nil {
		return
	}
	sound = models.Sound{
		"sound",
		user,
		source,
		int(time.Now().Unix()),
		false,
	}
	err = nil
	return
}

func soundSourceFromMatchedMap(matched []string) (source models.SoundSource, e error) {
	url := matched[0]
	vendor := vendorFromName(matched[2])
	hash := vendor.GetHash(url)
	if hash == "" {
		e = fmt.Errorf("%sが無効なハッシュと言った", url)
	}
	source = models.SoundSource{
		vendor,
		url,
		hash,
	}
	return
}
func vendorFromName(vendorName string) models.Vendor {
	switch vendorName {
	case "www.youtube.com":
		return models.YouTube{
			Name: "youtube",
		}
	case "soundcloud.com":
		return models.SoundCloud{
			Name: "soundcloud",
		}
	}
	return models.UnknownVendor{
		Name: "unknown",
	}
}

// NotSoundError ...
type NotSoundError struct {
	message string
}

func (nse NotSoundError) Error() string {
	return nse.message
}
