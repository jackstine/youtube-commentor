package repos

import (
	"youtube-commentor/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type LikesRepo struct {
	db *gorm.DB
}

func CreateLikesDislikesRepo() (*LikesRepo) {
	var repo LikesRepo
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	repo.db = db
  if err != nil {
    panic("failed to connect database")
  }
	db.AutoMigrate(&models.LikesDislikes{})
	// to get the name of the table use the following
	// stmt := &gorm.Statement{DB: db}
	// stmt.Parse(&models.LikesDislikes{})
	// fmt.Println(stmt.Schema.Table)
	return &repo
}

func (repo *LikesRepo) GetLikesForComments(comment_ids []string) (*[]models.LikesDislikes) {
	var likes []models.LikesDislikes
	repo.db.Find(&likes, "comment_id IN ?", comment_ids)
	return &likes
}

/*
This method is used only to add likes and dislikes
*/
func (repo *LikesRepo) AddLikes(likesToAdd []models.LikesDislikes) {
	for _,el := range likesToAdd {
		repo.db.Model(&el).Update("likes", gorm.Expr("likes + ?", el.Likes)).Update("dislikes", gorm.Expr("dislikes + ?", el.Dislikes))
	}
}


func (repo *LikesRepo) CreateNewLikes(comment_id string) {
	var likes models.LikesDislikes
	likes.Comment_id = comment_id
	likes.Dislikes = 0
	likes.Likes = 0
	repo.db.Create(likes)
}

func (repo *LikesRepo) DeleteAll_Never_Use() {
	repo.db.Exec("DELETE FROM likes_dislikes")
}

