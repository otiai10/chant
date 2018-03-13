package filters

import (
	"io"
	"io/ioutil"

	"github.com/otiai10/chant/server/models"

	yaml "gopkg.in/yaml.v2"
)

// PolicyType is accessibility policy default type.
type PolicyType string

const (
	// Whitelist means that this chat is CLOSED in default,
	// ONLY allowed users in whitelist can access.
	Whitelist PolicyType = "whitelist"
	// Blacklist means that this chat is OPEN in default,
	// ANY people can join this chat, BUT for one in blacklist.
	Blacklist PolicyType = "blacklist"
)

// Policy is accessibility policy of this chat room
type Policy struct {
	Type PolicyType `yaml:"type"`
	List []string   `yaml:"list"`

	Message MessagePolicy `yaml:"message" json:"message"`
}

// MessagePolicy represents storage policy for messages.
type MessagePolicy struct {
	DaysToLive int `yaml:"days_to_live"  json:"days_to_live"`
}

// NewPolicy decode given reader to Policy struct.
// Caller should close the reader if needed.
func NewPolicy(r io.Reader) *Policy {
	policy := &Policy{Blacklist, []string{}, MessagePolicy{5}}
	if r == nil {
		return policy
	}
	buf, err := ioutil.ReadAll(r)
	if err != nil {
		return policy
	}
	if err := yaml.Unmarshal(buf, policy); err != nil {
		return policy
	}
	return policy
}

// Allow returns true/false if this policy allows specified user.
func (policy *Policy) Allow(user *models.User) bool {
	if len(policy.List) == 0 {
		return policy.Type == Blacklist
	}
	for _, name := range policy.List {
		if user.Name == name {
			return policy.Type == Whitelist
		}
	}
	return policy.Type == Blacklist
}
