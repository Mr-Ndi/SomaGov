package controllers

import (
	"net/http"

	"somagov/services"

	"github.com/gin-gonic/gin"
)

func GetCategories(c *gin.Context) {
	categories, err := services.GetAllCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}
	c.JSON(http.StatusOK, categories)
}
