package services

import (
	"fmt"
	"time"

	"somagov/config"
	"somagov/models"
)

func CreateComplaint(complaint *models.Complaint) error {
	// Validate required fields
	if complaint.Title == "" {
		return fmt.Errorf("title is required")
	}
	if complaint.Description == "" {
		return fmt.Errorf("description is required")
	}
	if complaint.CategoryID == 0 {
		return fmt.Errorf("category_id is required")
	}
	if complaint.AgencyID == 0 {
		return fmt.Errorf("agency_id is required")
	}

	// Set default values
	complaint.Status = "submitted"
	complaint.CreatedAt = time.Now()
	complaint.UpdatedAt = time.Now()

	// Generate ticket code (you can customize this format)
	complaint.TicketCode = fmt.Sprintf("TKT-%d", time.Now().Unix())

	// Create the complaint
	if err := config.DB.Create(complaint).Error; err != nil {
		return fmt.Errorf("failed to create complaint: %w", err)
	}

	return nil
}

func GetComplaintByID(id uint) (*models.Complaint, error) {
	var complaint models.Complaint
	result := config.DB.Preload("User").Preload("Category").Preload("Agency").
		First(&complaint, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &complaint, nil
}

func GetComplaintsByUser(userID uint) ([]models.Complaint, error) {
	var complaints []models.Complaint
	err := config.DB.Where("user_id = ?", userID).Find(&complaints).Error
	return complaints, err
}

func UpdateComplaintStatus(id uint, newStatus string) error {
	var complaint models.Complaint
	if err := config.DB.First(&complaint, id).Error; err != nil {
		return err
	}
	complaint.Status = newStatus
	complaint.UpdatedAt = time.Now()
	return config.DB.Save(&complaint).Error
}
