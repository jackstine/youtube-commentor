package models

import (
	"fmt"
)

type LikeData struct {
	Like byte
}

type Like struct {
	LikeData
	User_id string `gorm:"index"`
	Comment_id string `gorm:"index;type:uuid"`
}

type UpdateLike struct {
	Like Like
	Update bool
}

func (like *Like) Print() {
	fmt.Println(like.Comment_id, like.User_id, like.Like)
}
