package models

import (
	"time"
)

type User struct {
	ID        uint    `gorm:"primaryKey"`
	FullName  string  `json:"full_name"`
	Email     string  `gorm:"unique" json:"email"`
	Password  string  `json:"-"`
	Role      string  `json:"role"`
	AgencyID  *uint   `json:"agency_id"`
	Agency    *Agency `gorm:"foreignKey:AgencyID"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
