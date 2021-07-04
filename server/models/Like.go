package models

type Like struct {
	Like byte
	User_id string `gorm:"index"`
	Comment_id string `gorm:"index;type:uuid"`
}
