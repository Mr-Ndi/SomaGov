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

func Login(ctx context.Context, db *gorm.DB, email, password string) (string, error) {
	var user models.User
	fmt.Printf("Attempting login for email: %s\n", email)

	// Try to find user by email
	err := db.WithContext(ctx).Where("email = ?", email).First(&user).Error
	if err != nil {
		fmt.Printf("Database error: %v\n", err)
		// If not found, check if it's the default admin credentials
		if errors.Is(err, gorm.ErrRecordNotFound) {
			adminEmail := os.Getenv("ADMAIL")
			adminPassword := os.Getenv("ADPASSWORD")
			fmt.Printf("User not found, checking admin credentials. Admin email set: %v\n", adminEmail != "")

			// Try to seed the admin dynamically if credentials match
			if email == adminEmail && password == adminPassword {
				fmt.Println("Attempting to seed admin account")
				if seedErr := SeedAdmin(db); seedErr != nil {
					fmt.Printf("Failed to seed admin: %v\n", seedErr)
					return "", errors.New("failed to auto-seed admin account")
				}
				// Try fetching the admin again
				err = db.WithContext(ctx).Where("email = ?", email).First(&user).Error
				if err != nil {
					fmt.Printf("Failed to fetch seeded admin: %v\n", err)
					return "", errors.New("admin creation succeeded, but login still failed")
				}
			} else {
				return "", errors.New("user not found")
			}
		} else {
			return "", errors.New("database error")
		}
	}

	fmt.Printf("User found, checking password for user ID: %d\n", user.ID)
	// Check password (if using hashing with optional salt)
	if ok := utils.CheckPasswordHash(password, user.Password); !ok {
		fmt.Println("Login failed: Incorrect password")
		return "", errors.New("invalid credentials")
	}

	fmt.Println("Password verified, generating token")
	// Generate token
	token, err := utils.GenerateJWT(user.ID, user.Role)
	if err != nil {
		fmt.Printf("Token generation failed: %v\n", err)
		return "", errors.New("failed to generate token")
	}

	fmt.Println("Login successful, token generated")
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

func SeedAdmin(db *gorm.DB) error {
	adminEmail := os.Getenv("ADMAIL")
	adminPassword := os.Getenv("ADPASSWORD")

	if adminEmail == "" || adminPassword == "" {
		return errors.New("admin credentials not configured")
	}

	// Hash the admin password
	hashedPass, err := utils.HashPassword(adminPassword)
	if err != nil {
		return fmt.Errorf("failed to hash admin password: %w", err)
	}

	// Create admin user
	admin := models.User{
		Email:    adminEmail,
		Password: hashedPass,
		Role:     "admin",
	}

	// Check if admin already exists
	var existingAdmin models.User
	if err := db.Where("email = ?", adminEmail).First(&existingAdmin).Error; err == nil {
		// Admin already exists, update password
		existingAdmin.Password = hashedPass
		return db.Save(&existingAdmin).Error
	}

	// Create new admin
	return db.Create(&admin).Error
}

func UpdateUserPassword(email, newPassword string) error {
	// Test the password hashing and verification
	if err := utils.TestPasswordHash(newPassword); err != nil {
		return fmt.Errorf("password hash test failed: %w", err)
	}

	hashedPass, err := utils.HashPassword(newPassword)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}

	result := config.DB.Model(&models.User{}).Where("email = ?", email).Update("password", hashedPass)
	if result.Error != nil {
		return fmt.Errorf("failed to update password: %w", result.Error)
	}
	if result.RowsAffected == 0 {
		return errors.New("user not found")
	}
	return nil
}
