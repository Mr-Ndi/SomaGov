package routes

import (
	"somagov/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterMetaRoutes(rg *gin.RouterGroup) {
	rg.GET("/agencies", controllers.GetAgencies)
	rg.GET("/categories", controllers.GetCategories)
}
