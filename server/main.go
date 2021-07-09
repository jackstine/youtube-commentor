package main

import (
	"youtube-commentor/logic"
	"youtube-commentor/models"
	"youtube-commentor/repos"
	"youtube-commentor/server"
)


func main() {
	repos.CreateCommentRepo().DeleteAll_Dont_Use()
	repos.CreateLikeRepo().DeleteAll_Do_Not_Use()
	repos.CreateLikesDislikesRepo().DeleteAll_Never_Use()
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
	logic.CreateANewComment(&comment)
	comment.User_id = "Cloud_Hopper"
	logic.CreateANewComment(&comment)
	comment.User_id = "RyanKHawkins"
	logic.CreateANewComment(&comment)
	comment.User_id = "Qorzzz"
	logic.CreateANewComment(&comment)
	comment.User_id = "Major_Lift"
	logic.CreateANewComment(&comment)
	server.StartServer()
}
