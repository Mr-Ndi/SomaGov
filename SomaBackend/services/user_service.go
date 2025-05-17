package services

import (
	"github.com/Mr-Ndi/SomaBackend/config"
	"github.com/Mr-Ndi/SomaBackend/models"
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
