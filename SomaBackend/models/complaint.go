package models

import (
	"time"
)

type Complaint struct {
	ID          uint     `gorm:"primaryKey"`
	UserID      uint     `json:"user_id"`
	User        User     `gorm:"foreignKey:UserID"`
	CategoryID  uint     `json:"category_id"`
	Category    Category `gorm:"foreignKey:CategoryID"`
	AgencyID    uint     `json:"agency_id"`
	Agency      Agency   `gorm:"foreignKey:AgencyID"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Status      string   `json:"status"`
	TicketCode  string   `gorm:"uniqueIndex"`
	Attachments string   `json:"attachments"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
