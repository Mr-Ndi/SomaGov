package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"somagov/database"
	"somagov/models"
	"somagov/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Set release mode
	gin.SetMode(gin.ReleaseMode)

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

	// Configure CORS
	router.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false, // Set to false when allowing all origins
		MaxAge:           12 * 60 * 60, // 12 hours
	}))

	// Create API group
	api := router.Group("/api")

	// Register routes
	routes.RegisterAuthRoutes(api)
	routes.RegisterUserRoutes(api)
	routes.RegisterCitizenRoutes(api)
	routes.RegisterAIRoutes(api)

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Create a channel to listen for errors coming from the listener.
	serverErrors := make(chan error, 1)

	// Start the service listening for requests.
	go func() {
		log.Printf("Server is starting on port %s", port)
		serverErrors <- router.Run(":" + port)
	}()

	// Create a channel to listen for an interrupt or terminate signal from the OS.
	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, os.Interrupt, syscall.SIGTERM)

	// Blocking main and waiting for shutdown.
	select {
	case err := <-serverErrors:
		if err != nil {
			log.Printf("Error starting server: %v", err)
			// Try alternative port if 8080 is in use
			if err.Error() == "listen tcp :8080: bind: address already in use" {
				altPort := "8081"
				log.Printf("Port 8080 in use, trying port %s", altPort)
				if err := router.Run(":" + altPort); err != nil {
					log.Fatalf("Failed to start server on alternative port: %v", err)
				}
			} else {
				log.Fatalf("Failed to start server: %v", err)
			}
		}

	case sig := <-shutdown:
		log.Printf("Shutdown signal received: %v", sig)
	}
}
