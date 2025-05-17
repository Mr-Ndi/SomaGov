package models

import (
	"time"
)

type Category struct {
	ID        uint   `gorm:"primaryKey"`
	Name      string `json:"name"`
	AgencyID  uint   `json:"agency_id"`
	Agency    Agency `gorm:"foreignKey:AgencyID"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
