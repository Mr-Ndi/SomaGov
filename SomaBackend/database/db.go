package database

import (
	"somagov/config"
	"somagov/models"
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
