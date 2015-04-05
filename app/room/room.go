package room

import (
	"chant/app/models"
	"time"
)

// Room まだ使ってないけど、"chatroom"っていう単位はプロセス1-1じゃないはず
type Room struct {
	ID string // 適当なUUID
	// インメモリアーカイブ
	Archives struct {
		Stamps   []models.Stamp // インメモリで覚えているスタンプ
		Sounds   []models.Sound // インメモリで覚えているサウンド
		Messages []models.Event // インメモリで覚えている発言イベント
	}
	// 参加者
	Members map[string]struct { // 参加者
		User models.User // 本来は、SubscriptionをUserに埋めたい
		// Subscription Subscription // とりあえずここにSubscription
	}
	// めた情報
	Info interface{} // TODO
	// いろいろあったときのチャンネル
	Channels struct {
		// Entrance  chan (<-chan Subscription) // 部屋に新しいひとが入ってきたときの
		Entrance  chan (<-chan *User)        // 部屋に新しいひとが入ってきたときの
		Exit      chan (<-chan models.Event) // 部屋から誰かが出て行ったときの
		Publish   chan models.Event          // イベントがあったときの
		Heartbeat *time.Ticker               // 一定時間ごとに、こちらからkeepaliveを送りたい
	}
}

// Get roomのインスタンスを取得
func Get() *Room {
	return &Room{}
}

// Forever Room 1個につき1回しか呼ばれない
// Roomのライフサイクルと一致している
// 当面は、1process - 1roomインスタンスで運用する
func (r *Room) Forever() {

}
