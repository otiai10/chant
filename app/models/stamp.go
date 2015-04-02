package models

// Stamp ...
type Stamp struct {
	Type        string
	Value       string
	RawText     string
	Timestamp   int
	IsUsedEvent bool
	Initial     bool
}
