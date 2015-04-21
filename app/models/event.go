package models

// Event ...
type Event struct {
	// TODO: "stamp", "sound" とかもTypeで処理したい
	Type      string // "join", "leave", or "message" だけじゃなくてもいいよね
	User      *User  // イベント発行ユーザ。ユーザに紐づかないものはnil
	Timestamp int64  // タイムスタンプ
	Text      string // valueに相当するもの
	RoomInfo  *Info  // 現在のRoomの状態を常に送信？ これいる？
	Initial   bool   // アーカイブイベントを初期接続で送るイベントかどうか
}
