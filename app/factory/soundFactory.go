package factory

import "time"
import "chant/app/models"

import "regexp"

func SoundFromText(text string, user *model.User) (sound model.Sound, err error) {
	exp, _ := regexp.Compile("(https?)://(soundcloud.com|www.youtube.com)/(.+)")
	matched := exp.FindAllStringSubmatch(text, 1)
	if len(matched) == 0 || len(matched[0]) < 4 {
		err = NotSoundError{"ようつべとサンクラじゃない"}
		return
	}
	sound = model.Sound{
		"sound",
		user,
		soundSourceFromMatchedMap(matched[0]),
		int(time.Now().Unix()),
	}
	err = nil
	return
}

func soundSourceFromMatchedMap(matched []string) model.SoundSource {
	url := matched[0]
	vendor := vendorFromName(matched[2])
	hash := vendor.GetHash(url)
	return model.SoundSource{
		vendor,
		url,
		hash,
	}
}
func vendorFromName(vendorName string) model.Vendor {
	switch vendorName {
	case "www.youtube.com":
		return model.YouTube{
			Name: "youtube",
		}
	case "soundcloud.com":
		return model.SoundCloud{
			Name: "soundcloud",
		}
	}
	return model.UnknownVendor{
		Name: "unknown",
	}
}

type NotSoundError struct {
	message string
}

func (nse NotSoundError) Error() string {
	return nse.message
}
