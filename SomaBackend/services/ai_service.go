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

type TranslationRequest struct {
	Text     string `json:"text"`
	FromLang string `json:"from_lang"`
	ToLang   string `json:"to_lang"`
}

type TranslationResponse struct {
	TranslatedText string `json:"translated_text"`
}

func TranslateText(text, fromLang, toLang string) (string, error) {
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		return "", fmt.Errorf("OpenAI API key not found")
	}

	url := "https://api.openai.com/v1/chat/completions"
	
	prompt := fmt.Sprintf("Translate the following text from %s to %s: %s", fromLang, toLang, text)
	
	requestBody := map[string]interface{}{
		"model": "gpt-3.5-turbo",
		"messages": []map[string]string{
			{
				"role":    "system",
				"content": "You are a professional translator. Translate the given text accurately while maintaining the original meaning and context.",
			},
			{
				"role":    "user",
				"content": prompt,
			},
		},
		"temperature": 0.3,
	}

	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return "", fmt.Errorf("error marshaling request: %v", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("error creating request: %v", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("error making request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("API request failed with status: %d", resp.StatusCode)
	}

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", fmt.Errorf("error decoding response: %v", err)
	}

	choices, ok := result["choices"].([]interface{})
	if !ok || len(choices) == 0 {
		return "", fmt.Errorf("invalid response format")
	}

	firstChoice, ok := choices[0].(map[string]interface{})
	if !ok {
		return "", fmt.Errorf("invalid choice format")
	}

	message, ok := firstChoice["message"].(map[string]interface{})
	if !ok {
		return "", fmt.Errorf("invalid message format")
	}

	content, ok := message["content"].(string)
	if !ok {
		return "", fmt.Errorf("invalid content format")
	}

	return content, nil
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