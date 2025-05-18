package controllers

import (
	"net/http"
	"somagov/models"

	"github.com/gin-gonic/gin"
)

func GetUserProfile(c *gin.Context) {
	// Get user from context (set by auth middleware)
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}

	// Return user profile
	c.JSON(http.StatusOK, user)
}

func UpdateUserProfile(c *gin.Context) {
	// Get user from context
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}

	// Get user model
	userModel := user.(models.User)

	// Bind request body
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

	// Update user fields if provided
	if updateData.Name != "" {
		userModel.Name = updateData.Name
	}
	if updateData.Email != "" {
		userModel.Email = updateData.Email
	}
	if updateData.Phone != "" {
		userModel.Phone = updateData.Phone
	}
	if updateData.Password != "" {
		userModel.Password = updateData.Password
	}

	// Save updated user
	if err := userModel.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, userModel)
}

func GetUserComplaints(c *gin.Context) {
	// Get user from context
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}

	// Get user model
	userModel := user.(models.User)

	// Get user's complaints
	var complaints []models.Complaint
	if err := models.DB.Where("user_id = ?", userModel.ID).Find(&complaints).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch complaints"})
		return
	}

	c.JSON(http.StatusOK, complaints)
} 