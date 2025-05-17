package services

import (
	"somagov/config"
	"somagov/models"
)

func GetAllAgencies() ([]models.Agency, error) {
	var agencies []models.Agency
	err := config.DB.Preload("Categories").Find(&agencies).Error
	return agencies, err
}
