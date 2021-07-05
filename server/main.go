package main

import (
	"youtube-commentor/models"
	"youtube-commentor/repos"
	"youtube-commentor/server"
)


func main() {
	commentRepo := repos.CreateCommentRepo()
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
	commentRepo.CreateComment(&comment)
	comment.User_id = "Cloud_Hopper"
	commentRepo.CreateComment(&comment)
	comment.User_id = "RyanKHawkins"
	commentRepo.CreateComment(&comment)
	server.StartServer()
}

