package models

type EventType string

const (
	ETJoin      EventType = "join"
	ETLeave     EventType = "leave"
	ETMessage   EventType = "message"
	ETStamprize EventType = "stamprize"
)

type Event struct {
	Type      EventType   `json:"type"`      // このイベントの種別
	Raw       string      `json:"raw"`       // このイベントの内容を
	Value     interface{} `json:"value"`     // このイベントの内容
	Timestamp uint64      `json:"timestamp"` // このイベントのpublish時間
	User      *User       `json:"user"`      // このイベントの発起人
}
