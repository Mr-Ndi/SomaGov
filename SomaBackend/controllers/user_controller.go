package controllers

import (
	"net/http"
	"somagov/config"
	"somagov/models"

	"github.com/gin-gonic/gin"
)

func GetUserProfile(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}
	c.JSON(http.StatusOK, user)
}

func UpdateUserProfile(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}

	userModel := user.(models.User)

	var updateData struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Phone    string `json:"phone"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if updateData.Name != "" {
		userModel.FullName = updateData.Name
	}
	if updateData.Email != "" {
		userModel.Email = updateData.Email
	}
	if updateData.Password != "" {
		userModel.Password = updateData.Password
	}

	if err := config.DB.Save(&userModel).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, userModel)
}

func GetUserComplaints(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}

	userModel := user.(models.User)

	var complaints []models.Complaint
	if err := config.DB.Where("user_id = ?", userModel.ID).Find(&complaints).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch complaints"})
		return
	}

	c.JSON(http.StatusOK, complaints)
}
