package models

// FirebaseConfigEmbed is used to be embeded to JavaScript
type FirebaseConfigEmbed struct {
	APIKey            string           `json:"apiKey"`
	AuthDomain        string           `json:"authDomain"`
	DatabaseURL       string           `json:"databaseURL"`
	ProjectID         string           `json:"projectId"`
	StorageBucket     string           `json:"storageBucket"`
	MessagingSenderID string           `json:"messagingSenderId"`
	Delegated         *DelegatedAccess `json:"delegated"`
}

// DelegatedAccess is independent to frontend (twitter) OAuth flow, we need to pass these just 1 time.
// https://firebase.google.com/docs/auth/web/twitter-login#handle_the_sign-in_flow_manually for more information.
type DelegatedAccess struct {
	Token  string `json:"token"`
	Secret string `json:"secret"`
}
