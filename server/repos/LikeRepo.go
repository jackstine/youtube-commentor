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

func CreateLikeRepo() (*LikeRepo) {
	var repo LikeRepo
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	repo.db = db
  if err != nil {
    panic("failed to connect database")
  }
	db.AutoMigrate(&models.Like{})
	return &repo
}

