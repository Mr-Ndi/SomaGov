package routes

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	public := router.Group("/api")
	{
		// This is where we will insert all auth and AI routes
	}

	protected := router.Group("/api")
	{
		// This is where turaza gutaho middlewares for securing some routes
	}
}
