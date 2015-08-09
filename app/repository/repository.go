package repository

import "chant/app/models"

// Repository オンメモリとか、Redisとか.
type Repository interface {
	pushMessage(string, ...*models.Event) error
	getMessages(string, int, int64) []*models.Event
	pushStamp(string, *models.Event) error
	getAllStamps(string) []*models.Event
}

var (
	// _impl Repository
	repos = map[string]Repository{
		"messages": NewDefaultRepository(),
		"stamps":   NewDefaultRepository(),
	}
)

// SetRepository ...
func SetRepository(key string, repo Repository) {
	repos[key] = repo
}

// InitWithInstance ...
/*
func InitWithInstance(repo Repository, force ...bool) error {
	force = append(force, false)
	if force[0] {
		_impl = repo
		return nil
	}
	if _impl != nil {
		return fmt.Errorf("repository is already initialized")
	}
	_impl = repo
	return nil
}
*/
