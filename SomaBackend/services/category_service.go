package services

import (
	"github.com/Mr-Ndi/SomaBackend/config"
	"github.com/Mr-Ndi/SomaBackend/models"
)

func GetAllCategories() ([]models.Category, error) {
	var categories []models.Category
	err := config.DB.Preload("Agency").Find(&categories).Error
	return categories, err
}
