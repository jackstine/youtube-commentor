package main

import (
	"fmt"
	"youtube-commentor/models"
	"youtube-commentor/repos"
)

func main() {
	commentRepo := repos.CreateRepo()
	comment := models.Comment{
		User_id: "byte_of_code",
		Time_stamp: 100,
		Comment: "This is the comment",
		Video_id: "id of the video",
		Parent: ""};
	first_uuid := commentRepo.CreateComment(&comment)
	comment.User_id = "Cloud_Hopper"
	second_uuid := commentRepo.CreateComment(&comment)
	comment.User_id = "RyanKHawkins"
	third_uuid := commentRepo.CreateComment(&comment)
	fmt.Println(first_uuid, second_uuid, third_uuid)
	var comment2 *models.Comment
  // // Read
	comment2 = commentRepo.SelectOne(first_uuid)
	fmt.Println(comment2.Comment) //
	fmt.Println(comment2.ID)
	fmt.Println(comment2.User_id) //

	var comments *[]models.Comment
	comments = commentRepo.SelectByVideo("id of the video")
	
	for _,el := range *comments {
		fmt.Println(el.Comment) //
		fmt.Println(el.ID)
		fmt.Println(el.User_id) //
	}
}

