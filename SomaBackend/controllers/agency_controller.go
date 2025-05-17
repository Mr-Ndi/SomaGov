package controllers

import (
	"net/http"

	"github.com/Mr-Ndi/SomaBackend/services"
	"github.com/gin-gonic/gin"
)

func GetAgencies(c *gin.Context) {
	agencies, err := services.GetAllAgencies()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch agencies"})
		return
	}
	c.JSON(http.StatusOK, agencies)
}
