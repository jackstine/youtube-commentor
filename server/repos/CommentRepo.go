package repos

import (
	"fmt"

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
	fmt.Println(first_uuid)
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
	repo.db.Find(&comments, "parnet = ?", commentID)
	return &comments
}

func CreateRepo() (*commentRepo) {
	var repo commentRepo
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	repo.db = db
  if err != nil {
    panic("failed to connect database")
  }
	db.AutoMigrate(&models.Comment{})
	return &repo
}

func main() {
  // Migrate the schema
	// db.AutoMigrate(&Like{})

	// db.Model(&comment).Update("Comment", "This comment was updated")
  // db.First(&comment, first_uuid) // find product with integer primary key
	// fmt.Println(comment.Comment) //
	// fmt.Println(comment.ID)
	// fmt.Println(comment.User_id) //


  // db.First(&comment, "code = ?", "D42") // find product with code D42

  // // Update - update product's price to 200
  // db.Model(&product).Update("Price", 200)
  // // Update - update multiple fields
  // db.Model(&product).Updates(Product{Price: 200, Code: "F42"}) // non-zero fields
  // db.Model(&product).Updates(map[string]interface{}{"Price": 200, "Code": "F42"})

  // // Delete - delete product
  // db.Delete(&product, 1)
}