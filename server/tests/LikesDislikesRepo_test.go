package test

import (
	"testing"
	"youtube-commentor/logic"
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
	ll := (*likes)[0]
	var like, dislike int
	comment_id := ll.CommentID
	like = 5
	dislike = 3
	repo.AddLike(comment_id, like, dislike)
	likes = repo.GetLikesForComments([]string{comment.ID})
	ll = (*likes)[0]
	if (ll.Likes != 5 && ll.Dislikes != 3) {
		t.Error("there was an issue with adding likes and dislikes")
	}
	dislike = 4
	like = 7
	comment_id = comment.ID
	repo.AddLike(comment_id, like, dislike)
	likes = repo.GetLikesForComments([]string{comment.ID})
	ll = (*likes)[0]
	if (ll.Likes != 12 && ll.Dislikes != 7) {
		t.Error("there was an issue with adding likes and dislikes")
	}
}



