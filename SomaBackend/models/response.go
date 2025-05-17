package models

import (
	"time"
)

type Response struct {
	ID          uint      `gorm:"primaryKey"`
	ComplaintID uint      `json:"complaint_id"`
	Complaint   Complaint `gorm:"foreignKey:ComplaintID"`
	UserID      uint      `json:"user_id"`
	User        User      `gorm:"foreignKey:UserID"`
	Message     string    `json:"message"`
	CreatedAt   time.Time
}
