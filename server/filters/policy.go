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
	Type      PolicyType `yaml:"type"`
	Whitelist []string   `yaml:"whitelist"`
	Blacklist []string   `yaml:"blacklist"`
}

// NewPolicy ...
func NewPolicy(f *os.File) *Policy {
	policy := &Policy{Blacklist, []string{}, []string{}}
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
	if policy.Type == Whitelist {
		return policy.inList(user, policy.Whitelist)
	}
	return !policy.inList(user, policy.Blacklist)
}

// inList ...
func (policy *Policy) inList(user *models.User, list []string) bool {
	for _, name := range list {
		print(name, user.Name)
		if user.Name == name {
			return true
		}
	}
	return false
}
