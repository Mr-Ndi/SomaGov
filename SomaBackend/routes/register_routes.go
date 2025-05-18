package routes

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.RouterGroup) {
	// api := r.Group("/api")

	// Authentication (public API)
	RegisterAuthRoutes(r)

	// Complaint APIs (authenticated API)
	RegisterCitizenRoutes(r)

	// Metadata (public API)
	RegisterMetaRoutes(r)
}
