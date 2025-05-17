package services

import (
	"somagov/config"
	"somagov/models"
)

func GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	if err := config.DB.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func CreateUser(user *models.User) error {
	return config.DB.Create(user).Error
}
