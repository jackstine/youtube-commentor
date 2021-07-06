package models

import (
	"fmt"
)


type Like struct {
	Like byte
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
