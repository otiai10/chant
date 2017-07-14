package filters

import (
	"io/ioutil"
	"os"

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
	Type    PolicyType `yaml:"type"`
	List    []string   `yaml:"list"`
	returns bool       `yaml:"-"`

	Message MessagePolicy `yaml:"message" json:"message"`
}

// MessagePolicy represents storage policy for messages.
type MessagePolicy struct {
	DaysToLive int `yaml:"days_to_live"  json:"days_to_live"`
}

// NewPolicy ...
func NewPolicy(f *os.File) *Policy {
	policy := &Policy{Blacklist, []string{}, false, MessagePolicy{5}}
	if f == nil {
		return policy
	}
	buf, err := ioutil.ReadAll(f)
	if err != nil {
		return policy
	}
	if err := yaml.Unmarshal(buf, policy); err != nil {
		return policy
	}
	f.Close()
	return policy
}

// Allow ...
func (policy *Policy) Allow(user *models.User) bool {
	return policy.Return().inList(user, policy.List)
}

// Return ...
func (policy *Policy) Return() *Policy {
	policy.returns = (policy.Type == Whitelist)
	return policy
}

// inList ...
func (policy *Policy) inList(user *models.User, list []string) bool {
	for _, name := range list {
		if user.Name == name {
			return policy.returns
		}
	}
	return !policy.returns
}
