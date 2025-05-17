package services

import (
	"context"
	"errors"
	"fmt"
	"os"
	"somagov/config"
	"somagov/models"
	"somagov/utils"

	"gorm.io/gorm"
)

func Login(ctx context.Context, email, password string) (string, error) {
	var user models.User
	db := config.DB

	// Try to find user by email
	err := db.Where("email = ?", email).First(&user).Error
	if err != nil {
		// If not found, check if it's the default admin credentials
		if errors.Is(err, gorm.ErrRecordNotFound) {
			adminEmail := os.Getenv("ADMAIL")
			adminPassword := os.Getenv("ADPASSWORD")

			// Try to seed the admin dynamically if credentials match
			if email == adminEmail && password == adminPassword {
				if seedErr := SeedAdmin(db); seedErr != nil {
					return "", errors.New("failed to auto-seed admin account")
				}
				// Try fetching the admin again
				err = db.Where("email = ?", email).First(&user).Error
				if err != nil {
					return "", errors.New("admin creation succeeded, but login still failed")
				}
			} else {
				return "", errors.New("user not found")
			}
		} else {
			return "", errors.New("database error")
		}
	}

	// Check password (if using hashing with optional salt)
	if ok := utils.CheckPasswordHash(password, user.Password); !ok {
		fmt.Println("Login failed: Incorrect password")
		return "", errors.New("invalid credentials")
	}

	// Prepare payload
	payload := map[string]interface{}{
		"email":   user.Email,
		"role":    user.Role,
		"user_id": user.ID.String(),
	}

	// Generate token
	token, err := utils.GenerateToken(payload)
	if err != nil {
		fmt.Println("Token generation failed:", err)
		return "", errors.New("failed to generate token")
	}

	return token, nil
}

func CreateUser(user *models.User) error {
	return config.DB.Create(user).Error
}
func FindUserByEmail(email string) (*models.User, error) {
	var user models.User
	if err := config.DB.Where("email = ?", email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}
