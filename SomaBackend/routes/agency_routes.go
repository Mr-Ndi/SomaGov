package routes

import (
	"somagov/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterAgencyRoutes(rg *gin.RouterGroup) {
	rg.GET("/agencies", controllers.GetAgencies)
	rg.POST("/agencies", controllers.CreateAgency)
	rg.PUT("/agencies/:id", controllers.UpdateAgency)
	rg.DELETE("/agencies/:id", controllers.DeleteAgency)
}
