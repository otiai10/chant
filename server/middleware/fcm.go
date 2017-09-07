package middleware

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"context"
)

const (
	fcmURL = "https://fcm.googleapis.com/fcm/send"
)

// Notification ...
type Notification struct {
	Title string `json:"title"`
	Body  string `json:"body"`
	Icon  string `json:"icon"`
}

// FCMClient ...
type FCMClient struct {
	httpclient *http.Client
}

// NewPushClient ...
func NewPushClient(ctx context.Context) *FCMClient {
	return &FCMClient{httpclient: HTTPClient(ctx)}
}

// Send ...
func (c *FCMClient) Send(n Notification, to string) error {
	b, err := json.Marshal(map[string]interface{}{
		"notification": n,
		"to":           to,
	})
	if err != nil {
		return err
	}
	req, err := http.NewRequest("POST", fcmURL, bytes.NewBuffer(b))
	if err != nil {
		return err
	}
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", fmt.Sprintf("key=%s", os.Getenv("FCM_SERVER_KEY")))
	_, err = c.httpclient.Do(req)
	if err != nil {
		return err
	}
	return nil
}
