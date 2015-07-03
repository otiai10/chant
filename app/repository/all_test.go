package repository

import (
	"testing"

	"chant.v1/app/models"

	. "github.com/otiai10/mint"
)

func TestDefauRepository(t *testing.T) {
	InitWithInstance(NewDefaultRepository())
	events := GetMessages(100, -1)
	Expect(t, len(events)).ToBe(0)
	PushMessage(&models.Event{
		Timestamp: 100,
		Value:     "001",
	})
	events = GetMessages(100, -1)
	Expect(t, len(events)).ToBe(1)
	PushMessage(&models.Event{
		Timestamp: 200,
		Value:     "002",
	})
	PushMessage(&models.Event{
		Timestamp: 300,
		Value:     "003",
	})
	PushMessage(&models.Event{
		Timestamp: 400,
		Value:     "004",
	})
	events = GetMessages(100, -1)
	Expect(t, len(events)).ToBe(4)

	events = GetMessages(2, -1)
	Expect(t, len(events)).ToBe(2)
	Expect(t, events[0].Value).ToBe("003")
	Expect(t, events[1].Value).ToBe("004")

	events = GetMessages(3, 300)
	Expect(t, len(events)).ToBe(2)
	Expect(t, events[0].Value).ToBe("001")
	Expect(t, events[1].Value).ToBe("002")

	Because(t, "archive size", func(t *testing.T) {
		repo := NewDefaultRepository()
		repo.MessageArchiveSize = 20
		InitWithInstance(repo, true)
		for i := 0; i < 60; i++ {
			PushMessage(&models.Event{
				Timestamp: int64(i),
				Value:     i,
			})
		}
		events = GetMessages(100, -1)
		Expect(t, len(events)).ToBe(20)
	})
}
