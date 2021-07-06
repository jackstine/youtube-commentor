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

/*
	the concept of a Full Comment is everything that the front end will need for a comment
*/
type FullComment struct {
	Comment
	LikesDislikesData
	LikeData
}

type CommentLikes struct {
	Comments []Comment
	Likes []LikesDislikes
}

func (fc *FullComment) Print() {
	fmt.Println(fc.ID, fc.Comment, fc.Likes, fc.Dislikes, fc.Like)
}

func (comment *Comment) Print() {
	fmt.Println(comment.ID, comment.User_id)
}

