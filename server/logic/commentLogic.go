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
	/*
	I can have one select for this 

	select comments.*, likes_dislikes.likes, likes_dislikes.dislikes FROM comments 
	join likes_dislikes ON likes.comment_id = comments.id
	join (select user_like, comment_id FROM likes where user_id = user AND 
		commnet_id IN (select id from comments where video_ids=)
	) ON likes.comment_id = comments.id
	where video_id = vid_id)


	select comments.*, likes_dislikes.likes, likes_dislikes.dislikes FROM comments 
	join likes_dislikes ON likes.comment_id = comments.id
	join likes ON likes.comment_id = comments.id AND likes.user_id = user
	where video_id = vid_id
	*/
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
