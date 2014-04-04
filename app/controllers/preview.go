package controllers

import (
	"github.com/robfig/revel"
    "fmt"
)

type Preview struct {
	*revel.Controller
}

type WebOGDetail struct {
    Title string
    Description string
    Image string
}

// さいしょのページレンダリングだけー
func (c Preview) Index() revel.Result {
    // TODO?: session check
    og := WebOGDetail{
        "【画像】この画家かわいすぎワロタｗｗｗｗｗｗｗそして抜いたｗｗｗｗ : キニ速",
        "1：名無しさん：2014/04/03(木)22:54:45ID:iRiTwCkI2小松美羽って人なんだけどたまんねぇｗｗｗｗｗ  死生観をテーマに作品作ってるアーティストらしい 小松美羽長野県埴科郡坂城町出身。2004年（平成16年）に女子美術大学短期大学部を卒業した。2009年（平成21年）に「",
        "http://livedoor.blogimg.jp/kinisoku/imgs/8/3/83fc01da.jpg",
    }
    fmt.Printf("[Preview Request]\n%+v", og)
    return c.RenderJson(og)
}

func init() {
	// revel.Controller.*が実行されるときに必ず呼べる？
	// TWITTER.Debug(true)
}
