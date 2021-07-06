package test

import (
	"testing"
	"youtube-commentor/logic"
	"youtube-commentor/repos"
)

func TestCreateANewComment(t *testing.T) {
	comment := GetComment()
	logic.CreateANewComment(&comment)
	sc := repos.CreateCommentRepo().SelectOne(comment.ID) 
	assertComment(t, *sc, comment)
}


func TestGetCommentsFromVideo(t *testing.T) {
	repos.CreateCommentRepo().DeleteAll_Dont_Use()
	repos.CreateLikesDislikesRepo().DeleteAll_Never_Use()
	comment := GetComment()
	logic.CreateANewComment(&comment)
	logic.CreateANewComment(&comment)
	logic.CreateANewComment(&comment)
	commentsLikes := logic.GetCommentsFromVideo(comment.Video_id)
	for _,c := range commentsLikes.Comments {
		c.Print()
	}
	if (len(commentsLikes.Comments) == 0) {
		t.Error("Get Commetns From Video did not return any comments")
	}
	if (len(commentsLikes.Comments) != len(commentsLikes.Likes)) {
		t.Error("Get CommentsFromVideo did not return equal number of Comments and Likes")
	}
}



