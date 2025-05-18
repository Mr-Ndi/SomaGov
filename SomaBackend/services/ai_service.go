package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

// AIConfig holds configuration for AI services
type AIConfig struct {
	HuggingFaceToken string
	LibreTranslateURL string
}

// CategoryPrediction represents the response from Hugging Face's zero-shot classification
type CategoryPrediction struct {
	Labels []string  `json:"labels"`
	Scores []float64 `json:"scores"`
}

// Initialize AI configuration
var aiConfig = AIConfig{
	HuggingFaceToken: os.Getenv("HUGGINGFACE_TOKEN"),
	LibreTranslateURL: "https://translate.argosopentech.com/translate", // Using public instance
}

// PredictCategory uses Hugging Face's zero-shot classification to categorize complaint text
func PredictCategory(text string, categories []string) (*CategoryPrediction, error) {
	// Prepare request body
	requestBody := map[string]interface{}{
		"inputs": text,
		"parameters": map[string]interface{}{
			"candidate_labels": categories,
		},
	}

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request body: %w", err)
	}

	// Create request
	req, err := http.NewRequest(
		"POST",
		"https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
		bytes.NewBuffer(jsonBody),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	req.Header.Set("Authorization", "Bearer "+aiConfig.HuggingFaceToken)
	req.Header.Set("Content-Type", "application/json")

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	// Check response status
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request failed with status: %d", resp.StatusCode)
	}

	// Parse response
	var prediction CategoryPrediction
	if err := json.NewDecoder(resp.Body).Decode(&prediction); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &prediction, nil
}

// TranslateText translates text between languages using LibreTranslate
func TranslateText(text, sourceLang, targetLang string) (string, error) {
	// Prepare request body
	requestBody := map[string]string{
		"q":      text,
		"source": sourceLang,
		"target": targetLang,
		"format": "text",
	}

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request body: %w", err)
	}

	// Create request
	req, err := http.NewRequest(
		"POST",
		aiConfig.LibreTranslateURL,
		bytes.NewBuffer(jsonBody),
	)
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	// Check response status
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("translation request failed with status: %d", resp.StatusCode)
	}

	// Parse response
	var result struct {
		TranslatedText string `json:"translatedText"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", fmt.Errorf("failed to decode response: %w", err)
	}

	return result.TranslatedText, nil
}

// AnalyzeSentiment uses Hugging Face to detect sentiment in text
func AnalyzeSentiment(text string) (string, float64, error) {
	// Prepare request body
	requestBody := map[string]string{
		"inputs": text,
	}

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		return "", 0, fmt.Errorf("failed to marshal request body: %w", err)
	}

	// Create request
	req, err := http.NewRequest(
		"POST",
		"https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
		bytes.NewBuffer(jsonBody),
	)
	if err != nil {
		return "", 0, fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	req.Header.Set("Authorization", "Bearer "+aiConfig.HuggingFaceToken)
	req.Header.Set("Content-Type", "application/json")

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", 0, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	// Check response status
	if resp.StatusCode != http.StatusOK {
		return "", 0, fmt.Errorf("sentiment analysis request failed with status: %d", resp.StatusCode)
	}

	// Parse response
	var result []struct {
		Label string  `json:"label"`
		Score float64 `json:"score"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", 0, fmt.Errorf("failed to decode response: %w", err)
	}

	if len(result) == 0 {
		return "", 0, fmt.Errorf("no sentiment analysis result")
	}

	return result[0].Label, result[0].Score, nil
} 