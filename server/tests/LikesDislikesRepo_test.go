package test

import (
	"testing"
	"youtube-commentor/logic"
	"youtube-commentor/models"
	"youtube-commentor/repos"
)

func TestGetLikesForComments(t *testing.T) {
	repo := repos.CreateLikesDislikesRepo()
	comment := GetComment()
	logic.CreateANewComment(&comment)
	likes := repo.GetLikesForComments([]string{comment.ID})
	for _,l := range *likes {
		if (l.Likes != 0 && l.Dislikes != 0) {
			t.Error("A newly created likesDislikes should be 0")
		}
	}
}

func TestAddLikes(t *testing.T) {
	repo := repos.CreateLikesDislikesRepo()
	comment := GetComment()
	logic.CreateANewComment(&comment)
	likes := repo.GetLikesForComments([]string{comment.ID})
	l := (*likes)[0]
	l.Likes = 5
	l.Dislikes = 3
	repo.AddLikes([]models.LikesDislikes{l})
	likes = repo.GetLikesForComments([]string{comment.ID})
	l = (*likes)[0]
	if (l.Likes != 5 && l.Dislikes != 3) {
		t.Error("there was an issue with adding likes and dislikes")
	}
	var adding_likes models.LikesDislikes
	adding_likes.Dislikes = 4
	adding_likes.Likes = 7
	adding_likes.Comment_id = comment.ID
	repo.AddLikes([]models.LikesDislikes{adding_likes})
	likes = repo.GetLikesForComments([]string{comment.ID})
	l = (*likes)[0]
	if (l.Likes != 12 && l.Dislikes != 7) {
		t.Error("there was an issue with adding likes and dislikes")
	}
}



