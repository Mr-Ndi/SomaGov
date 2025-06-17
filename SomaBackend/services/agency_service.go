package services

import (
	"somagov/database"
	"somagov/models"

	"golang.org/x/crypto/bcrypt"
)

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CreateAgency(agency *models.Agency) error {
	hashedPassword, err := hashPassword(agency.Password)
	if err != nil {
		return err
	}
	agency.Password = hashedPassword
	return database.DB.Create(agency).Error
}

func GetAllAgencies() ([]models.Agency, error) {
	var agencies []models.Agency
	err := database.DB.Find(&agencies).Error
	return agencies, err
}

// func CreateAgency(agency *models.Agency) error {
// 	return database.DB.Create(agency).Error
// }

func DeleteAgency(id uint) error {
	return database.DB.Delete(&models.Agency{}, id).Error
}

func GetAgencyByID(id uint) (models.Agency, error) {
	var agency models.Agency
	err := database.DB.First(&agency, id).Error
	return agency, err
}

func UpdateAgency(id uint, updated *models.Agency) error {
	var agency models.Agency
	if err := database.DB.First(&agency, id).Error; err != nil {
		return err
	}
	agency.Name = updated.Name
	agency.Telephone = updated.Telephone
	agency.Address = updated.Address
	return database.DB.Save(&agency).Error
}
