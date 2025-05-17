package database

import (
	"github.com/Mr-Ndi/SomaBackend/config"
	"github.com/Mr-Ndi/SomaBackend/models"
)

func AutoMigrate() {
	config.DB.AutoMigrate(
		&models.User{},
		&models.Agency{},
		&models.Category{},
		&models.Complaint{},
		&models.Response{},
	)
}
