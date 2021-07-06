package logic

import (
	"youtube-commentor/models"
	"youtube-commentor/repos"
)

func CreateANewComment(comment *models.Comment) {
	repos.CreateCommentRepo().CreateComment(comment)
	repos.CreateLikesDislikesRepo().CreateNewLikes(comment.ID)
}

func GetCommentsFromVideo(video_id string) (*models.CommentLikes) {
	comments := repos.CreateCommentRepo().SelectByVideo(video_id)
	var comment_ids []string
	for _,el := range *comments {
		comment_ids = append(comment_ids, el.ID)
	}
	likes := repos.CreateLikesDislikesRepo().GetLikesForComments(comment_ids)
	var commentLikes models.CommentLikes
	commentLikes.Comments = *comments
	commentLikes.Likes = *likes
	return &commentLikes
}
