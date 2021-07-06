package repos

import (
	"youtube-commentor/models"

	"github.com/google/uuid"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type commentRepo struct {
	db *gorm.DB
}

func (repo *commentRepo) CreateComment(comment *models.Comment) (string) {
	first_uuid := uuid.New()
	comment.ID = first_uuid.String()
	repo.db.Create(comment)
	return first_uuid.String()
}

func (repo *commentRepo) SelectOne(id string) (*models.Comment) {
	var comment models.Comment
  repo.db.First(&comment,"id = ?", id) // find product with integer primary key
	return &comment
}

func (repo *commentRepo) SelectByVideo(videoID string) (*[]models.Comment) {
	var comments []models.Comment
	repo.db.Find(&comments, "video_id = ?", videoID)
	return &comments
}

func (repo *commentRepo) SelectByComment(commentID string) (*[]models.Comment) {
	var comments []models.Comment
	repo.db.Find(&comments, "parent = ?", commentID)
	return &comments
}

func (repo *commentRepo) UpdateComment(comment *models.Comment) {
	repo.db.Model(&models.Comment{}).Where("id = ?", comment.ID).Update("comment", comment.Comment)
}

func (repo *commentRepo) DeleteAll_Dont_Use() {
	repo.db.Exec("DELETE FROM comments")
}

func (repo *commentRepo) GetFullCommentsFromVideo(video_id string, user string) (*[]models.FullComment) {
	var fullComments []models.FullComment
	sql := repo.db.Model(&models.Comment{}).Select("comments.*, likes_dislikes.likes, likes_dislikes.dislikes, likes.like")
	sql = sql.Joins("left join likes_dislikes ON likes_dislikes.comment_id = comments.id")
	sql = sql.Joins("left join likes ON likes.comment_id = comments.id AND likes.user_id = ?", user)
	sql.Where("comments.video_id = ?", video_id).Scan(&fullComments)
	return &fullComments
	/*
		select comments.*, likes_dislikes.likes, likes_dislikes.dislikes FROM comments 
	join likes_dislikes ON likes.comment_id = comments.id
	join likes ON likes.comment_id = comments.id AND likes.user_id = user
	where video_id = vid_i
	*/
}

func (repo *commentRepo) GetFullCommentsFromComment(comment_id string, user string) (*[]models.FullComment) {
	var fullComments []models.FullComment
	sql := repo.db.Model(&models.Comment{}).Select("comments.*, likes_dislikes.likes, likes_dislikes.dislikes, likes.like")
	sql = sql.Joins("left join likes_dislikes ON likes_dislikes.comment_id = comments.id")
	sql = sql.Joins("left join likes ON likes.comment_id = comments.id AND likes.user_id = ?", user)
	sql.Where("comments.parent = ?", comment_id).Scan(&fullComments)
	return &fullComments
	/*
		select comments.*, likes_dislikes.likes, likes_dislikes.dislikes FROM comments 
	join likes_dislikes ON likes.comment_id = comments.id
	join likes ON likes.comment_id = comments.id AND likes.user_id = user
	where comment.parent = comment_id 
	*/
}


func CreateCommentRepo() (*commentRepo) {
	var repo commentRepo
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	repo.db = db
  if err != nil {
    panic("failed to connect database")
  }
	db.AutoMigrate(&models.Comment{})
	return &repo
}
