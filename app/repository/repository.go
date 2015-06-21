package repository

import (
	"fmt"
	"chant.v1/app/models"
)

// Repository オンメモリとか、Redisとか.
type Repository interface {
	AddMember(*models.User) error
}

var (
	_instance Repository
)

func InitWithInstance(repo Repository) error {
	if _instance != nil {
		return fmt.Errorf("repository is already initialized")
	}
	_instance = repo
	return nil
}

func AddMember(user *models.User) error {
	return _instance.AddMember(user)
}
