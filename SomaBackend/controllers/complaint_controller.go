package controllers

import (
	"net/http"
	"strconv"

	"github.com/Mr-Ndi/SomaBackend/models"
	"github.com/Mr-Ndi/SomaBackend/services"

	"github.com/gin-gonic/gin"
)

func CreateComplaint(c *gin.Context) {
	var complaint models.Complaint
	if err := c.ShouldBindJSON(&complaint); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.MustGet("user_id").(uint)
	complaint.UserID = userID

	if err := services.CreateComplaint(&complaint); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit complaint"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Complaint submitted successfully",
		"ticket":  complaint.TicketCode,
	})
}

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
