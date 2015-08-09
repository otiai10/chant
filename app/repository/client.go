package repository

import "chant/app/models"

// Client ...
type Client struct {
	ns string
}

// NewRepoClient ...
func NewRepoClient(roomname string) *Client {
	return &Client{roomname}
}

// PushMessage ...
func (client *Client) PushMessage(evs ...*models.Event) error {
	return repos["messages"].pushMessage(client.ns, evs...)
}

// GetMessages ...
func (client *Client) GetMessages(count int, from int64) []*models.Event {
	return repos["messages"].getMessages(client.ns, count, from)
}

// GetAllStamps ...
func (client *Client) GetAllStamps() []*models.Event {
	return repos["stamps"].getAllStamps(client.ns)
}

// PushStamp ...
func (client *Client) PushStamp(ev *models.Event) error {
	return repos["stamps"].pushStamp(client.ns, ev)
}
