package models

import (
	"time"
)

type Agency struct {
	ID          uint       `gorm:"primaryKey"`
	Name        string     `json:"name"`
	Description string     `json:"description"`
	Categories  []Category `gorm:"foreignKey:AgencyID"`
	Users       []User     `gorm:"foreignKey:AgencyID"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
