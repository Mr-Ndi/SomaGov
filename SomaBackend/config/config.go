package config

import (
	"fmt"
	"log"
	"os"

	models "somagov/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Global DB instance
var DB *gorm.DB

func ConnectDB() error {
	dsn := os.Getenv("DATABASE_URL")

	if dsn == "" {
		return fmt.Errorf("DATABASE_URL is not set in environment variables")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	err = db.AutoMigrate(&models.User{}, &models.Agency{}, &models.Category{}, &models.Complaint{}, &models.Response{})
	if err != nil {
		return fmt.Errorf("migration failed: %w", err)
	}

	DB = db
	log.Println("--------------------------------------------------------------")
	log.Println("Connected to PostgreSQL and migrated successfully!")
	log.Println("--------------------------------------------------------------")
	return nil
}
