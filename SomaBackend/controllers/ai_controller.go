package controllers

import (
	"net/http"

	"somagov/services"

	"github.com/gin-gonic/gin"
)

type TranslationRequest struct {
	Text     string `json:"text" binding:"required"`
	FromLang string `json:"from_lang" binding:"required"`
	ToLang   string `json:"to_lang" binding:"required"`
}

type TranslationResponse struct {
	TranslatedText string `json:"translated_text"`
}

func TranslateTextHandler(c *gin.Context) {
	var req TranslationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	translatedText, err := services.TranslateText(req.Text, req.FromLang, req.ToLang)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Translation failed"})
		return
	}

	c.JSON(http.StatusOK, TranslationResponse{
		TranslatedText: translatedText,
	})
} 