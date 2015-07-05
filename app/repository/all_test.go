package repository

import (
	"testing"

	"chant.v1/app/models"

	. "github.com/otiai10/mint"
)

func TestDefauRepository(t *testing.T) {
	InitWithInstance(NewDefaultRepository())
	client := NewRepoClient("default")
	events := client.GetMessages(100, -1)
	Expect(t, len(events)).ToBe(0)
	client.PushMessage(&models.Event{
		Timestamp: 100,
		Value:     "001",
	})
	events = client.GetMessages(100, -1)
	Expect(t, len(events)).ToBe(1)
	client.PushMessage(&models.Event{
		Timestamp: 200,
		Value:     "002",
	})
	client.PushMessage(&models.Event{
		Timestamp: 300,
		Value:     "003",
	})
	client.PushMessage(&models.Event{
		Timestamp: 400,
		Value:     "004",
	})
	events = client.GetMessages(100, -1)
	Expect(t, len(events)).ToBe(4)

	events = client.GetMessages(2, -1)
	Expect(t, len(events)).ToBe(2)
	Expect(t, events[0].Value).ToBe("003")
	Expect(t, events[1].Value).ToBe("004")

	events = client.GetMessages(3, 300)
	Expect(t, len(events)).ToBe(2)
	Expect(t, events[0].Value).ToBe("001")
	Expect(t, events[1].Value).ToBe("002")
}
