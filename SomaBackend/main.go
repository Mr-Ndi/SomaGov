package main

import (
	"log"
	"os"

	"somagov/database"
	"somagov/models"
	"somagov/routes"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Connect to database
	if err := database.Connect(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Run migrations
	if err := database.DB.AutoMigrate(&models.User{}, &models.Agency{}, &models.Category{}, &models.Complaint{}, &models.Response{}); err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	// Set up router
	router := gin.Default()

	// Create API group
	api := router.Group("/api")

	// Register routes
	routes.RegisterAuthRoutes(api)
	routes.RegisterUserRoutes(api)
	routes.RegisterCitizenRoutes(api)
	routes.RegisterAIRoutes(api)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
