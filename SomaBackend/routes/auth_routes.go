package routes

import (
	"somagov/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(rg *gin.RouterGroup) {
	rg.POST("/register", controllers.Register)
	rg.POST("/login", controllers.Login)
	rg.POST("/update-password", controllers.UpdatePassword)
}
