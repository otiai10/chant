package models

// EventType Event.Type enum
type EventType string

const (
	// TypeJoin Roomに参加した
	TypeJoin EventType = "join"
	// TypeLeave Room から抜けた
	TypeLeave EventType = "leave"
	// TypeMessage 発言
	TypeMessage EventType = "message"
	// TypeStampAdd スタンプを追加
	TypeStampAdd EventType = "stamp.add"
	// TypeStampUse スタンプを使用
	TypeStampUse EventType = "stamp.use"
	// TypeKeepalive キープアライブ
	TypeKeepalive EventType = "keepalive"
)

// Event ...
type Event struct {
	// TODO: "stamp", "sound" とかもTypeで処理したい
	Type      string `json:"type"`      // "join", "leave", or "message" だけじゃなくてもいいよね
	User      *User  `json:"user"`      // イベント発行ユーザ。ユーザに紐づかないものはnil
	Timestamp int64  `json:"timestamp"` // タイムスタンプ
	Text      string `json:"text"`      // valueに相当するもの
	RoomInfo  *Info  `json:"info"`      // 現在のRoomの状態を常に送信？ これいる？
	Initial   bool   `json:"initial"`   // アーカイブイベントを初期接続で送るイベントかどうか
}
