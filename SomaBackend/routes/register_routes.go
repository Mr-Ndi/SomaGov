package routes

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")

	// Authentication (public API)
	RegisterAuthRoutes(api)

	// Complaint APIs (authenticated API)
	RegisterCitizenRoutes(api)

	// Metadata (public API)
	RegisterMetaRoutes(api)
}
