package services

import (
	"somagov/config"
	"somagov/models"
)

func GetAllCategories() ([]models.Category, error) {
	var categories []models.Category
	err := config.DB.Preload("Agency").Find(&categories).Error
	return categories, err
}
