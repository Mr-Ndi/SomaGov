package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"somagov/config"
	"somagov/routes"
	"somagov/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if os.Getenv("RENDER") == "" {
		if err := godotenv.Load(); err != nil {
			log.Fatal("Error loading .env file")
		}
	}

	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	// Enable CORS for www.example.com
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://www.example.com", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Connect to DB
	if err := config.ConnectDB(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Seed data
	if err := services.SeedInitialData(); err != nil {
		log.Printf("Warning: Failed to seed initial data: %v", err)
	}

	// Register all routes
	api := r.Group("/api")
	routes.RegisterRoutes(api)
	routes.RegisterAuthRoutes(api)
	routes.RegisterUserRoutes(api)
	routes.RegisterAIRoutes(api)

	// Start server
	fmt.Println("Server running at: http://localhost:8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
