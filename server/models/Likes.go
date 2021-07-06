package models

/*
* likes are both likes and dislikes for a single comment,
* suppose to represent the count of all the likes and dislikes
 */
type LikesDislikesData struct {
	Likes uint32
	Dislikes uint32
}


type LikesDislikes struct {
	LikesDislikesData
	Comment_id string `gorm:"type:uuid;primaryKey"`
}
