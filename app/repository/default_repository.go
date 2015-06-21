package repository

import "chant.v1/app/models"


// DefaultRepository コードのスタックを使ったやつ.
type DefaultRepository struct {
	members map[string]*models.User
}

func NewDefaultRepository() Repository {
	return &DefaultRepository{
		members: map[string]*models.User{},
	}
}

func (repo *DefaultRepository) AddMember(user *models.User) error {
	repo.members[user.IDstr] = user
	return nil
}