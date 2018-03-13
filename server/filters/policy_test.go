package filters

import (
	"strings"
	"testing"

	"github.com/otiai10/chant/provider/identity"
	"github.com/otiai10/chant/server/models"
	. "github.com/otiai10/mint"
)

const (
	p0 = ``
	p1 = `
type: whitelist
list:
  - otiai20
`
	p2 = `
type: blacklist
list:
  - otiai20
`
)

func TestNewPolicy(t *testing.T) {
	policy := NewPolicy(strings.NewReader(p1))
	Expect(t, policy).TypeOf("*filters.Policy")
}

func TestPolicy_Allow(t *testing.T) {
	When(t, "policy is a whitelist", func(t *testing.T) {
		policy := NewPolicy(strings.NewReader(p1))
		user := &models.User{Identity: identity.Identity{Name: "otiai10"}}
		Expect(t, policy.Allow(user)).ToBe(false)
		user.Name = "otiai20"
		Expect(t, policy.Allow(user)).ToBe(true)
	})
	When(t, "policy is a blacklist", func(t *testing.T) {
		policy := NewPolicy(strings.NewReader(p2))
		user := &models.User{Identity: identity.Identity{Name: "otiai10"}}
		Expect(t, policy.Allow(user)).ToBe(true)
		user.Name = "otiai20"
		Expect(t, policy.Allow(user)).ToBe(false)
	})
	When(t, "policy is empty", func(t *testing.T) {
		policy := NewPolicy(strings.NewReader(p0))
		Expect(t, policy.Type).ToBe(Blacklist)
		user := &models.User{Identity: identity.Identity{Name: "otiai10"}}
		Expect(t, policy.Allow(user)).ToBe(true)
	})
}
