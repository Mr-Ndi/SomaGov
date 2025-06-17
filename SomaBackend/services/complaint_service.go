package services

import (
	"fmt"
	"time"

	"somagov/database"
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

	// Get all available categories
	var categories []models.Category
	if err := database.DB.Find(&categories).Error; err != nil {
		return fmt.Errorf("failed to fetch categories: %w", err)
	}

	// Extract category names for AI prediction
	categoryNames := make([]string, len(categories))
	for i, cat := range categories {
		categoryNames[i] = cat.Name
	}

	// Use AI to predict category
	prediction, err := PredictCategory(complaint.Description, categoryNames)
	if err != nil {
		// Log the error but continue without AI prediction
		fmt.Printf("AI categorization failed: %v\n", err)
	} else if len(prediction.Labels) > 0 {
		// Find the category with the highest score
		bestCategory := prediction.Labels[0]
		for _, cat := range categories {
			if cat.Name == bestCategory {
				complaint.CategoryID = cat.ID
				complaint.AgencyID = cat.ID
				break
			}
		}
	}

	// Analyze sentiment if category is not provided
	if complaint.CategoryID == 0 {
		// If AI categorization failed, require manual category selection
		if complaint.CategoryID == 0 {
			return fmt.Errorf("category_id is required when AI categorization fails")
		}
		if complaint.AgencyID == 0 {
			return fmt.Errorf("agency_id is required when AI categorization fails")
		}
	}

	// Analyze sentiment for urgency
	sentiment, score, err := AnalyzeSentiment(complaint.Description)
	if err != nil {
		// Log the error but continue without sentiment analysis
		fmt.Printf("Sentiment analysis failed: %v\n", err)
	} else if sentiment == "NEGATIVE" && score > 0.8 {
		// Set high urgency for strongly negative sentiment
		complaint.Status = "urgent"
	} else {
		complaint.Status = "submitted"
	}

	// Set timestamps
	complaint.CreatedAt = time.Now()
	complaint.UpdatedAt = time.Now()

	// Generate ticket code
	complaint.TicketCode = fmt.Sprintf("TKT-%d", time.Now().Unix())

	// Create the complaint
	if err := database.DB.Create(complaint).Error; err != nil {
		return fmt.Errorf("failed to create complaint: %w", err)
	}

	return nil
}

func GetComplaintByID(id uint) (*models.Complaint, error) {
	var complaint models.Complaint
	result := database.DB.Preload("User").Preload("Category").Preload("Agency").
		First(&complaint, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &complaint, nil
}

func GetComplaintsByUser(userID uint) ([]models.Complaint, error) {
	var complaints []models.Complaint
	err := database.DB.
		Preload("User").
		Preload("Category").
		Preload("Agency").
		Where("user_id = ?", userID).
		Find(&complaints).Error
	return complaints, err
}

func UpdateComplaintStatus(id uint, newStatus string) error {
	var complaint models.Complaint
	if err := database.DB.First(&complaint, id).Error; err != nil {
		return err
	}
	complaint.Status = newStatus
	complaint.UpdatedAt = time.Now()
	return database.DB.Save(&complaint).Error
}
