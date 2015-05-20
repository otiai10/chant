package room

import "chant/app/models"

// Archives だったりそうでなかったりするアーカイブ
type Archives interface {
	Add(event models.Event)
	Get() []models.Event
}

// MessageArchive type == "message" なEventをアーカイブする
// メッセージのアーカイブは、ユニークでなくていいので、sliceでいい
type MessageArchive struct {
	Size     int            // アーカイブサイズ
	Messages []models.Event // アーカイブの内容
}

// Add to implement Archives
func (ma *MessageArchive) Add(event models.Event) {
	// ここでswitchしたくない
	switch event.Type {
	case "join", "leave":
		return
	}
	ma.Messages = append(ma.Messages, event)
	if len(ma.Messages) > ma.Size {
		ma.Messages = ma.Messages[len(ma.Messages)-ma.Size:]
	}
}

// Get to implement Archives
func (ma *MessageArchive) Get() []models.Event {
	return ma.Messages
}

// StampArchive type == "stamp" (今はまだない) なEventをアーカイブする
// Stamp は、Last Recently Used で管理する
type StampArchive struct {
	Size   int            // アーカイブサイズ
	Stamps []models.Event // アーカイブの内容
}

// Add to implement Archives
// 登録時だろうと、使ったときだろうと、ここにくる
func (sa StampArchive) Add(event models.Event) {
	dest := []models.Event{}
	for _, stamp := range sa.Stamps {
		// 同じものはスキップする
		if stamp.Text == event.Text {
			continue
		}
		dest = append(dest, stamp)
	}
	// 最後に、これを足す
	dest = append(dest, event)
	if len(dest) > sa.Size {
		dest = dest[len(dest)-sa.Size:]
	}
	sa.Stamps = dest
}
