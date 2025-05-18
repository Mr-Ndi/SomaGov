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

	// Format: $argon2id$v=19$m=65536,t=3,p=2$salt$hash
	encoded := fmt.Sprintf("$argon2id$v=19$m=%d,t=%d,p=%d$%s$%s",
		memory, timeCost, threads,
		base64.RawStdEncoding.EncodeToString(salt),
		base64.RawStdEncoding.EncodeToString(hash),
	)

	// Verify the generated hash format
	if !TestHashFormat(encoded) {
		return "", fmt.Errorf("generated hash has invalid format: %s", encoded)
	}

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

	// Check format parts
	if parts[0] != "" || parts[1] != "argon2id" {
		fmt.Printf("Invalid hash format: wrong prefix\n")
		return false
	}

	// Check version
	if parts[2] != "v=19" {
		fmt.Printf("Invalid version string in hash\n")
		return false
	}

	// Parse parameters from part[3]
	paramStr := parts[3]
	var mem, t, p uint32
	_, err := fmt.Sscanf(paramStr, "m=%d,t=%d,p=%d", &mem, &t, &p)
	if err != nil {
		fmt.Printf("Failed to parse parameters: %v\n", err)
		return false
	}

	fmt.Printf("Parsed parameters: m=%d, t=%d, p=%d\n", mem, t, p)

	// Decode salt (parts[4]) and hash (parts[5])
	salt, err := base64.RawStdEncoding.DecodeString(parts[4])
	if err != nil {
		fmt.Printf("Failed to decode salt: %v\n", err)
		return false
	}

	hash, err := base64.RawStdEncoding.DecodeString(parts[5])
	if err != nil {
		fmt.Printf("Failed to decode hash: %v\n", err)
		return false
	}

	// Re-generate the hash with the same parameters and salt
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

// TestHashFormat verifies that a hash string matches the expected format
func TestHashFormat(hash string) bool {
	fmt.Printf("Testing hash format: %s\n", hash)
	parts := strings.Split(hash, "$")
	if len(parts) != 6 {
		fmt.Printf("Invalid hash format: expected 6 parts, got %d\n", len(parts))
		return false
	}

	if parts[0] != "" || parts[1] != "argon2id" {
		fmt.Printf("Invalid hash format: wrong prefix\n")
		return false
	}

	// Check version string
	if parts[2] != "v=19" {
		fmt.Printf("Invalid version string in hash: %s\n", parts[2])
		return false
	}

	// Parse parameters (shifted to parts[3])
	paramStr := parts[3]
	var mem, t, p uint32
	_, err := fmt.Sscanf(paramStr, "m=%d,t=%d,p=%d", &mem, &t, &p)
	if err != nil {
		fmt.Printf("Failed to parse parameters: %v\n", err)
		return false
	}

	fmt.Printf("Parsed parameters: m=%d, t=%d, p=%d\n", mem, t, p)

	// Validate values
	if mem != memory || t != timeCost || p != threads {
		fmt.Printf("Invalid parameter values: got m=%d,t=%d,p=%d, want m=%d,t=%d,p=%d\n",
			mem, t, p, memory, timeCost, threads)
		return false
	}

	// Validate salt and hash parts
	if _, err := base64.RawStdEncoding.DecodeString(parts[4]); err != nil {
		fmt.Printf("Invalid salt encoding: %v\n", err)
		return false
	}
	if _, err := base64.RawStdEncoding.DecodeString(parts[5]); err != nil {
		fmt.Printf("Invalid hash encoding: %v\n", err)
		return false
	}

	return true
}

// TestPasswordHash is a helper function to test password hashing and verification
func TestPasswordHash(password string) error {
	hash, err := HashPassword(password)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}

	// Print the generated hash for debugging
	fmt.Printf("Generated hash: %s\n", hash)

	// Skip format validation for now
	// if !TestHashFormat(hash) {
	//     return fmt.Errorf("generated hash has invalid format: %s", hash)
	// }

	if !CheckPasswordHash(password, hash) {
		return fmt.Errorf("password verification failed for hash: %s", hash)
	}

	return nil
}
