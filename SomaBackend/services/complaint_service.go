package services

import (
	"time"

	"github.com/Mr-Ndi/SomaBackend/config"
	"github.com/Mr-Ndi/SomaBackend/models"
)

func CreateComplaint(complaint *models.Complaint) error {
	complaint.Status = "submitted"
	complaint.CreatedAt = time.Now()
	complaint.UpdatedAt = time.Now()

	// Igisigaye: Add AI categorization + agency assignment if needed

	return config.DB.Create(complaint).Error
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
