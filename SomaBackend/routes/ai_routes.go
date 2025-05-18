package routes

import (
	"somagov/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterAIRoutes(rg *gin.RouterGroup) {
	ai := rg.Group("/ai")
	{
		ai.POST("/translate", controllers.TranslateTextHandler)
	}
}
