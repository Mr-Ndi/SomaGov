package services

import (
	"somagov/config"
	"somagov/models"
)

func GetAllAgencies() ([]models.Agency, error) {
	var agencies []models.Agency
	err := config.DB.Preload("Categories").Find(&agencies).Error
	return agencies, err
}

func SeedInitialData() error {
	// Create initial agencies
	agencies := []models.Agency{
		{
			Name:        "Roads and Infrastructure",
			Description: "Handles road maintenance and infrastructure issues",
		},
		{
			Name:        "Public Health",
			Description: "Handles public health and sanitation issues",
		},
	}

	// Create agencies and their categories
	for i := range agencies {
		if err := config.DB.Create(&agencies[i]).Error; err != nil {
			return err
		}

		// Create categories for each agency
		categories := []models.Category{
			{
				Name:     "Potholes",
				AgencyID: agencies[i].ID,
			},
			{
				Name:     "Street Lights",
				AgencyID: agencies[i].ID,
			},
			{
				Name:     "Drainage",
				AgencyID: agencies[i].ID,
			},
		}

		for j := range categories {
			if err := config.DB.Create(&categories[j]).Error; err != nil {
				return err
			}
		}
	}

	return nil
}
