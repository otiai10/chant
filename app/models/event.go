package models

import (
	"encoding/json"
	"log"
	"reflect"
	"time"
)

// めんどい // type EventType string
const (
	JOIN      = "join"
	LEAVE     = "leave"
	MESSAGE   = "message"
	STAMPRIZE = "stamprize"
	STAMPUSE  = "stampuse"
	MUTE      = "mute"
	UNMUTE    = "unmute"
	AMESH     = "amesh"
	KICK      = "kick"
	LIVEON    = "liveon"
)

// Event ...
type Event struct {
	Type      string                 `json:"type"`      // このイベントの種別
	Raw       string                 `json:"raw"`       // このイベントの内容をjson stringにしたもの
	Value     interface{}            `json:"value"`     // このイベントの内容
	Params    map[string]interface{} `json:"params"`    // なんか
	Timestamp int64                  `json:"timestamp"` // このイベントのpublish時間
	User      *User                  `json:"user"`      // このイベントの発起人
}

// ConstructEvent ...
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
	case STAMPRIZE:
		stamprized := new(Event) // stamprizeされたほうの内容
		if err := json.Unmarshal([]byte(event.Raw), stamprized); err != nil {
			log.Println("stamprize error", err)
		}
		event.Value = stamprized
	case STAMPUSE:
		// messageに偽装<s>する</s>しない
		// stampuseされたほうの内容
		stampused := new(Event)
		if err := json.Unmarshal([]byte(event.Raw), stampused); err != nil {
			log.Println("stampuse error", err)
		}
		// TimestampとUserだけ偽造しよう
		stampused.Timestamp = event.Timestamp
		stampused.User = event.User
		event.Raw = stampused.Raw
		event.Value = stampused
	case MUTE, UNMUTE:
		muted := new(Event)
		if err := json.Unmarshal([]byte(event.Raw), muted); err != nil {
			log.Println("mute/unmute error", err)
		}
		event.Value = muted
	case JOIN:
	}
	return event, nil
}

// StamplyEqual ...
func (ev *Event) StamplyEqual(target *Event) bool {
	stamprized0, ok := ev.Value.(*Event)
	if !ok {
		return false
	}
	stamprized1, ok := target.Value.(*Event)
	if !ok {
		return false
	}
	return reflect.DeepEqual(stamprized0.Value, stamprized1.Value)
}

// NewMessage construct MESSAGE event.
func NewMessage(user *User, text string) *Event {
	return &Event{
		User: user,
		Type: MESSAGE,
		Raw:  text,
		Value: map[string]interface{}{
			"text": text,
		},
		Timestamp: time.Now().UnixNano(),
	}
}
