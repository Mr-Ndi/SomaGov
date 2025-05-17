package services

import (
	"github.com/Mr-Ndi/SomaBackend/config"
	"github.com/Mr-Ndi/SomaBackend/models"
)

func GetAllAgencies() ([]models.Agency, error) {
	var agencies []models.Agency
	err := config.DB.Preload("Categories").Find(&agencies).Error
	return agencies, err
}
