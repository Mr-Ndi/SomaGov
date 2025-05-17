package main

import (
	"github.com/Mr-Ndi/SomaBackend/config"
	"github.com/Mr-Ndi/SomaBackend/database"
	"github.com/Mr-Ndi/SomaBackend/routes"

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
