package routes

import (
	"github.com/Mr-Ndi/SomaBackend/controllers"
	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(rg *gin.RouterGroup) {
	rg.POST("/register", controllers.Register)
	rg.POST("/login", controllers.Login)
}
