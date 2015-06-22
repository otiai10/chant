package models

import (
	"encoding/json"
	"time"
)

// めんどい // type EventType string
const (
	JOIN      = "join"
	LEAVE     = "leave"
	MESSAGE   = "message"
	STAMPRIZE = "stamprize"
)

type Event struct {
	Type      string                 `json:"type"`      // このイベントの種別
	Raw       string                 `json:"raw"`       // このイベントの内容を
	Value     interface{}            `json:"value"`     // このイベントの内容
	Params    map[string]interface{} `json:"params"`    // なんか
	Timestamp int64                  `json:"timestamp"` // このイベントのpublish時間
	User      *User                  `json:"user"`      // このイベントの発起人
}

func ConstructEvent(user *User, raw string) (*Event, error) {
	event := new(Event)
	if err := json.Unmarshal([]byte(raw), event); err != nil {
		return event, err
	}
	event.Timestamp = time.Now().UnixNano()
	event.User = user
	switch event.Type {
	case MESSAGE:
		event.Value = map[string]interface{}{
			"text": event.Raw,
		}
	case JOIN:
	}
	return event, nil
}
