package repos

import (
	"youtube-commentor/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type LikeRepo struct {
	db *gorm.DB
}

func (repo *LikeRepo) CreateLike(like *models.Like) (*models.Like) {
	repo.db.Create(like)
	repo.db.AutoMigrate(&models.Like{})
	return like 
}

func (repo *LikeRepo) UpdateLike(like *models.Like) (*models.Like) {
	repo.db.Model(like).Where("user_id = ? AND comment_id = ?", like.User_id, like.Comment_id).Update("like", like.Like)
	return like
}

func (repo *LikeRepo) SelectByUserIdAndCommentId(userID string, commentID string) (*models.Like) {
	var like models.Like
	repo.db.First(&like, "comment_id = ? and user_id = ?", commentID, userID)
	return &like
}


func (repo *LikeRepo) DeleteAll_Do_Not_Use() {
	repo.db.Exec("DELETE FROM likes")
}

// we do not need this query anymore 
// DEPRECATED
// func (repo *LikeRepo) GetLikesForComment(commentIDs []string) (*[]models.LikesDislikes) {
// 	var likesDislikes []models.LikesDislikes
// 	likes:= repo.db.Model(&models.Like{}).Select("COUNT(like)").Where("like = 1 AND comment_id IN ?", commentIDs)
// 	dislikes:= repo.db.Model(&models.Like{}).Select("COUNT(like)").Where("like = 2")
// 	repo.db.Table("(?) as likes, (?) as dislikes", likes, dislikes).Find(&likesDislikes)
// 	return &likesDislikes
// }

// func (repo *LikeRepo) SelectLikesForComment(commentID string) (*[]byte) {
// /**

// */
// }

func CreateLikeRepo() (*LikeRepo) {
	var repo LikeRepo
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	repo.db = db
  if err != nil {
    panic("failed to connect database")
  }
	db.AutoMigrate(&models.Like{})
	// stmt := &gorm.Statement{DB: db}
	// stmt.Parse(&models.Like{})
	// fmt.Println(stmt.Schema.Table)
	return &repo
}

