package main

import (
	"fmt"
	"log"

	"somagov/config"
	"somagov/routes"
	"somagov/services"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	// Connect to DB and handle any errors
	if err := config.ConnectDB(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Seed initial data
	if err := services.SeedInitialData(); err != nil {
		log.Printf("Warning: Failed to seed initial data: %v", err)
	}

	// Register all routes
	routes.RegisterRoutes(r)
	routes.RegisterAuthRoutes(r)
	routes.RegisterUserRoutes(r)
	routes.RegisterAIRoutes(r)

	// Start server
	fmt.Println("Server running at: http://localhost:8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
