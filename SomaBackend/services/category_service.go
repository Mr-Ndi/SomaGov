package services

import (
	"somagov/database"
	"somagov/models"
)

func GetAllCategories() ([]models.Category, error) {
	var categories []models.Category
	err := database.DB.Preload("Agency").Find(&categories).Error
	return categories, err
}
