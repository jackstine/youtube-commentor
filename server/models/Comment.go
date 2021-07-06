package models

import "fmt"


type Comment struct {
	ID string `gorm:"type:uuid;primaryKey"`
	Time_stamp uint32
	User_id string
	Comment string
	Video_id string `gorm:"index"`
	Parent string `gorm:"index;type:uuid"`
}

type CommentLikes struct {
	Comments []Comment
	Likes []LikesDislikes
}

func (comment *Comment) Print() {
	fmt.Println(comment.ID, comment.User_id)
}

