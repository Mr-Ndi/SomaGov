package controllers

import (
	"net/http"

	"somagov/config"
	"somagov/models"
	"somagov/services"
	"somagov/utils"

	"github.com/gin-gonic/gin"
)

func Register(c *gin.Context) {
	var user models.User

	// Bind and validate input
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	// Check if user with email already exists
	existingUser, err := services.FindUserByEmail(user.Email)
	if err != nil {
		// optional: log error
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Something went wrong while checking existing user"})
		return
	}
	if existingUser != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User with this email already exists"})
		return
	}

	// Hash password mbere yo kuyibika
	hashedPass, err := utils.HashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	user.Password = hashedPass

	// Create user after satisfying all necessary conditions
	if err := services.CreateUser(&user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}

func Login(c *gin.Context) {
	var loginData struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	token, err := services.Login(c.Request.Context(), config.DB, loginData.Email, loginData.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}
