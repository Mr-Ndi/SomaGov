package controllers

import (
	"net/http"
	"strconv"

	"somagov/services"

	"github.com/gin-gonic/gin"
)

// func CreateComplaint(c *gin.Context) {
// 	var complaint models.Complaint
// 	if err := c.ShouldBindJSON(&complaint); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid input: %v", err)})
// 		return
// 	}

// 	// Get user ID from JWT token
// 	userID, exists := c.Get("user_id")
// 	if !exists {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
// 		return
// 	}
// 	complaint.UserID = userID.(uint)

// 	// Create the complaint
// 	if err := services.CreateComplaint(&complaint); err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to submit complaint: %v", err)})
// 		return
// 	}

// 	c.JSON(http.StatusCreated, gin.H{
// 		"message": "Complaint submitted successfully",
// 		"ticket":  complaint.TicketCode,
// 		"data":    complaint,
// 	})
// }

func GetMyComplaints(c *gin.Context) {
	userID := c.GetUint("user_id")
	complaints, err := services.GetComplaintsByUser(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve complaints"})
		return
	}
	c.JSON(http.StatusOK, complaints)
}

func GetComplaintByID(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	complaint, err := services.GetComplaintByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Complaint not found"})
		return
	}
	c.JSON(http.StatusOK, complaint)
}
