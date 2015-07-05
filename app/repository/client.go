package repository

import "chant.v1/app/models"

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
	return _impl.pushMessage(client.ns, evs...)
}

// GetMessages ...
func (client *Client) GetMessages(count int, from int64) []*models.Event {
	return _impl.getMessages(client.ns, count, from)
}
