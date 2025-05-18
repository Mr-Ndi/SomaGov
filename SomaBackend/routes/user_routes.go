package routes

import (
	"somagov/controllers"
	"somagov/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterUserRoutes(rg *gin.RouterGroup) {
	user := rg.Group("/users")
	{
		user.Use(middleware.AuthMiddleware())
		user.GET("/profile", controllers.GetUserProfile)
		user.PUT("/profile", controllers.UpdateUserProfile)
		user.GET("/complaints", controllers.GetUserComplaints)
	}
} 