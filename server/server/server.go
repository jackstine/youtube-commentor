package server

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"youtube-commentor/logic"
	"youtube-commentor/models"
	"youtube-commentor/repos"

	"github.com/rs/cors"
)

func UnmarshalBody(r *http.Request, context interface{}) (error) {
	// returns err
	// json.NewDecoder(r.Body).Decode(&comment) // did not 
	// this worked
	b,_ := io.ReadAll(r.Body)
	fmt.Println(b)
	err := json.Unmarshal(b, context)
	return err
}

func Send(w http.ResponseWriter, data interface{}) {
		w.Header().Set("Content-Type", "application/json")
		js,_ := json.Marshal(data)
		w.Write(js)
}

func handleComment(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		// GET will return all comments (replies) with the comment id
		commentID := r.URL.Query()["comment"]
		comments := repos.CreateCommentRepo().SelectByComment(commentID[0])
		Send(w, comments)
	} else if r.Method == "POST" {
		// POST will post a new comment
		var comment models.Comment
		err := UnmarshalBody(r, &comment)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		logic.CreateANewComment(&comment)
		Send(w, comment)
	} else if r.Method == "PUT" {
		// TODO need to update the comment
		// PUT will update the comment
		var comment models.Comment
		err := UnmarshalBody(r, comment)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		repos.CreateCommentRepo().UpdateComment(&comment)
		Send(w, comment)
	}
}

func handleCommentForVideo(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		// GET will return all comments (replies) with the comment id
		videoID := r.URL.Query()["video"]
		commentLikes := logic.GetCommentsFromVideo(videoID[0])
		Send(w, commentLikes)
	}
}

func handleLike(w http.ResponseWriter, r *http.Request) {
	var like models.UpdateLike
	UnmarshalBody(r, &like)
	if (like.Update) {
		repos.CreateLikeRepo().UpdateLike(&like.Like)
	} else {
		repos.CreateLikeRepo().CreateLike(&like.Like)
	}
	Send(w, like)
}

func StartServer() {
	mux := http.NewServeMux()
	mux.HandleFunc("/comment", handleComment)
	// GET will reutrn all comments for that video
	mux.HandleFunc("/comment/video", handleCommentForVideo)
	handler := cors.Default().Handler(mux)
	// Get will reutrn all likes for Comment
	// Post will create a like
	// Put will update a like
	// http.HandleFunc("/like", handleLike)

	fmt.Printf("Starting server at port http://localhost:8080\n")
	if err := http.ListenAndServe(":8080", handler); err != nil {
			log.Fatal(err)
	}
}

