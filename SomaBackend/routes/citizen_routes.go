package routes

import (
	"github.com/Mr-Ndi/SomaBackend/controllers"
	"github.com/Mr-Ndi/SomaBackend/middleware"
	"github.com/gin-gonic/gin"
)

func RegisterCitizenRoutes(rg *gin.RouterGroup) {
	complaint := rg.Group("/complaints")
	complaint.Use(middleware.JWTAuth())
	{
		complaint.POST("/", controllers.CreateComplaint)
		complaint.GET("/mine", controllers.GetMyComplaints)
		complaint.GET("/:id", controllers.GetComplaintByID)
	}
}
