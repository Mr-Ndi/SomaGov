package controllers

import (
	"net/http"
	"somagov/models"
	"somagov/services"

	"github.com/gin-gonic/gin"
)

func CreateComplaint(c *gin.Context) {
	// Get user from context
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}

	// Get user model
	userModel := user.(models.User)

	// Bind request body
	var complaint models.Complaint
	if err := c.ShouldBindJSON(&complaint); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Set user ID
	complaint.UserID = userModel.ID

	// Create complaint
	if err := services.CreateComplaint(&complaint); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create complaint"})
		return
	}

	c.JSON(http.StatusCreated, complaint)
}

func GetCitizenComplaints(c *gin.Context) {
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

func GetComplaint(c *gin.Context) {
	// Get complaint ID from URL
	complaintID := c.Param("id")

	// Get user from context
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}

	// Get user model
	userModel := user.(models.User)

	// Get complaint
	var complaint models.Complaint
	if err := models.DB.Where("id = ? AND user_id = ?", complaintID, userModel.ID).First(&complaint).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Complaint not found"})
		return
	}

	c.JSON(http.StatusOK, complaint)
}

func UpdateComplaint(c *gin.Context) {
	// Get complaint ID from URL
	complaintID := c.Param("id")

	// Get user from context
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}

	// Get user model
	userModel := user.(models.User)

	// Get existing complaint
	var complaint models.Complaint
	if err := models.DB.Where("id = ? AND user_id = ?", complaintID, userModel.ID).First(&complaint).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Complaint not found"})
		return
	}

	// Bind request body
	var updateData struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Status      string `json:"status"`
	}

	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Update complaint fields if provided
	if updateData.Title != "" {
		complaint.Title = updateData.Title
	}
	if updateData.Description != "" {
		complaint.Description = updateData.Description
	}
	if updateData.Status != "" {
		complaint.Status = updateData.Status
	}

	// Save updated complaint
	if err := models.DB.Save(&complaint).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update complaint"})
		return
	}

	c.JSON(http.StatusOK, complaint)
}

func DeleteComplaint(c *gin.Context) {
	// Get complaint ID from URL
	complaintID := c.Param("id")

	// Get user from context
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}

	// Get user model
	userModel := user.(models.User)

	// Delete complaint
	result := models.DB.Where("id = ? AND user_id = ?", complaintID, userModel.ID).Delete(&models.Complaint{})
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete complaint"})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Complaint not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Complaint deleted successfully"})
} 