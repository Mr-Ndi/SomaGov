package config

import (
	"log"
	"os"

	models "somagov/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Global DB instance
var DB *gorm.DB

func ConnectDB() {
	// Get the database URL from environment variables
	dsn := os.Getenv("DATABASE_URL")
	// fmt.Println("DATABASE_URL:", dsn)

	if dsn == "" {
		log.Fatal("--------------------------------------------------------------")
		log.Fatal("DATABASE_URL is not set in environment variables")
		log.Fatal("--------------------------------------------------------------")
	}

	// Connect to PostgreSQL
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		log.Fatal("--------------------------------------------------------------")
		log.Fatalf("Failed to connect to database: %v", err)
		log.Fatal("--------------------------------------------------------------")
	}

	// Run AutoMigrate to apply schema changes
	err = db.AutoMigrate(&models.User{}, &models.Agency{}, &models.Category{}, &models.Complaint{}, &models.Response{})
	if err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	// Assign DB instance to global variable
	DB = db
	log.Println("--------------------------------------------------------------")
	log.Println("Connected to PostgreSQL and migrated successfully!")
	log.Println("--------------------------------------------------------------")
}
