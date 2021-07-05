package test

import (
	"testing"
	"youtube-commentor/models"
	"youtube-commentor/repos"
)

func getComment() (models.Comment) {
	user_id := "byte_of_code"
	time_stamp := uint32(100)
	string_comment := "This is the comment"
	video_id := "id of the video" 
	comment := models.Comment{
		User_id: user_id,
		Time_stamp: time_stamp,
		Comment: string_comment,
		Video_id: video_id,
		Parent: ""};
	return comment
}

// sc is the selected comment
func assertComment(t *testing.T, sc models.Comment, comment models.Comment) {
	if sc.Comment != comment.Comment{
		t.Error("the comments do not equal eachother")
	}
	if sc.Time_stamp != comment.Time_stamp{
		t.Error("the time_stamp does not equal eachother")
	}
	if sc.ID != comment.ID {
		t.Error("the ids do not equal")
	}
	if sc.User_id != comment.User_id {
		t.Error("the user ids do not equal")
	}
}

func TestSelectByVideo(t *testing.T) {
	comment := getComment()
	commentRepo := repos.CreateCommentRepo()
	commentRepo.CreateComment(&comment)
	comment.User_id = "Cloud_Hopper"
	commentRepo.CreateComment(&comment)
	comment.User_id = "RyanKHawkins"
	commentRepo.CreateComment(&comment)
	var comments *[]models.Comment
	comments = commentRepo.SelectByVideo(comment.Video_id)
	for _,el := range *comments {
		if (el.Video_id != comment.Video_id) {
			t.Error("one of the comments does not have the correct video ID")
		}
	}
}

func TestSelectOne(t *testing.T) {
	comment := getComment()
	commentRepo := repos.CreateCommentRepo()
	first_uuid := commentRepo.CreateComment(&comment)
	var sc *models.Comment // selectedComment
	sc = commentRepo.SelectOne(first_uuid)
	assertComment(t, *sc, comment)
}
