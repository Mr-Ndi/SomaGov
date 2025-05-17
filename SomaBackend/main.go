package main

import (
	"fmt"

	"somagov/config"
	"somagov/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	// Connect to DB
	config.ConnectDB()

	// Register all routes
	routes.RegisterRoutes(r)

	// Start server
	fmt.Println("http://localhost:8080")
	r.Run(":8080")
}
