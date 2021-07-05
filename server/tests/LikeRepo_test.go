package test

import (
	"testing"
	"youtube-commentor/models"
	"youtube-commentor/repos"
)

func createLike(repo *repos.LikeRepo, name string) (*models.Like){
	var like models.Like
	like.Comment_id = "2475bd19-5056-4dba-9599-d021747a1e9d"
	if name == "" {
		like.User_id = "Major_Lift"
	} else {
		like.User_id = name
	}
	like.Like = 1
	repo.CreateLike(&like)
	return &like
}

func assertLike(t *testing.T, sl *models.Like, like *models.Like) {
	if (sl.Comment_id != like.Comment_id) {
		t.Error("the comment ids are not the same")
	}
	if (sl.User_id != like.User_id) {
		t.Error("the user id are not the same")
	}
	if (sl.Like != like.Like) {
		t.Error("the liks are not equal")
	}
}

func TestSelectByUserIdAndCommentId(t *testing.T) {
	repo := repos.CreateLikeRepo()
	like := createLike(repo, "")
	sl := repo.SelectByUserIdAndCommentId(like.User_id, like.Comment_id)
	assertLike(t, sl, like)
}

func TestUpdateLike(t *testing.T) {
	repo := repos.CreateLikeRepo()
	like_2 := createLike(repo, "disaster_robot")
	like_2.Like = 2
	repo.UpdateLike(like_2)
	sl_2 := repo.SelectByUserIdAndCommentId(like_2.User_id, like_2.Comment_id)
	assertLike(t, sl_2, like_2)
}

