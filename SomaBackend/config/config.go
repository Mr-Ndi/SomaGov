package config

import (
	"os"
)

var (
	// JWTSecret is the secret key used to sign JWT tokens
	JWTSecret = []byte(getEnv("JWT_SECRET", "your-secret-key"))
)

// getEnv gets an environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
