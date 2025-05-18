package utils

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"strings"

	"golang.org/x/crypto/argon2"
)

const (
	memory     = 64 * 1024
	timeCost   = 3
	threads    = 2
	keyLen     = 32
	saltLength = 16
)

// Hashing a Password for returning an encoded hash (salt + settings + derived key)
func HashPassword(password string) (string, error) {
	salt := make([]byte, saltLength)
	_, err := rand.Read(salt)
	if err != nil {
		return "", err
	}

	hash := argon2.IDKey([]byte(password), salt, timeCost, memory, uint8(threads), keyLen)

	encoded := fmt.Sprintf("$argon2id$v=19$m=%d,t=%d,p=%d$%s$%s",
		memory, timeCost, threads,
		base64.RawStdEncoding.EncodeToString(salt),
		base64.RawStdEncoding.EncodeToString(hash),
	)

	return encoded, nil
}

// CheckPasswordHash function izajya verifies password against the encoded Argon2 hash tukabona gukomeza
func CheckPasswordHash(password, encodedHash string) bool {
	fmt.Printf("Checking password hash. Hash format: %s\n", encodedHash)
	parts := strings.Split(encodedHash, "$")
	if len(parts) != 6 {
		fmt.Printf("Invalid hash format: expected 6 parts, got %d\n", len(parts))
		return false
	}

	// Extract parameters from the format string
	paramStr := parts[2]
	var mem, t, p uint32
	_, err := fmt.Sscanf(paramStr, "m=%d,t=%d,p=%d", &mem, &t, &p)
	if err != nil {
		fmt.Printf("Failed to parse parameters: %v\n", err)
		return false
	}

	fmt.Printf("Parsed parameters: m=%d, t=%d, p=%d\n", mem, t, p)

	salt, err := base64.RawStdEncoding.DecodeString(parts[3])
	if err != nil {
		fmt.Printf("Failed to decode salt: %v\n", err)
		return false
	}

	hash, err := base64.RawStdEncoding.DecodeString(parts[4])
	if err != nil {
		fmt.Printf("Failed to decode hash: %v\n", err)
		return false
	}

	newHash := argon2.IDKey([]byte(password), salt, t, mem, uint8(p), uint32(len(hash)))
	result := subtleCompare(hash, newHash)
	fmt.Printf("Password verification result: %v\n", result)
	return result
}

// subtleCompare checks byte slices in constant time
func subtleCompare(a, b []byte) bool {
	if len(a) != len(b) {
		return false
	}
	var result byte = 0
	for i := 0; i < len(a); i++ {
		result |= a[i] ^ b[i]
	}
	return result == 0
}
