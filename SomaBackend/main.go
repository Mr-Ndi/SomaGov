package main

import (
	"SomaBackend/config"
	"SomaBackend/database"
	"SomaBackend/routes"

	"github.com/Mr-Ndi/SomaBackend/database"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Load ENV
	config.LoadEnv()

	// Connect to DB
	config.ConnectDB()
	database.AutoMigrate()

	// Register all routes
	routes.RegisterRoutes(r)

	// Start server
	r.Run(":8080")
}
