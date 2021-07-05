package server

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"youtube-commentor/models"
	"youtube-commentor/repos"
)

func generateComment(r *http.Request) (*models.Comment, error) {
	var comment *models.Comment
	// returns err
	err := json.NewDecoder(r.Body).Decode(comment)
	return comment, err
}

func handleComment(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		// GET will return all comments (replies) with the comment id
		commentID := r.URL.Query()["comment"]
		comments := repos.CreateCommentRepo().SelectByComment(commentID[0])
		w.Header().Set("Content-Type", "application/json")
		js,_ := json.Marshal(comments)
		w.Write(js)
	} else if r.Method == "POST" {
		// POST will post a new comment
		comment, err := generateComment(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		repos.CreateCommentRepo().CreateComment(comment)
		fmt.Fprint(w, "success")
	} else if r.Method == "PUT" {
		// PUT will update the comment
		comment, err := generateComment(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		repos.CreateCommentRepo().UpdateComment(comment)
	}
}

func handleCommentForVideo(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		// GET will return all comments (replies) with the comment id
		videoID := r.URL.Query()["video"]
		comments := repos.CreateCommentRepo().SelectByVideo(videoID[0])
		w.Header().Set("Content-Type", "application/json")
		js,_ := json.Marshal(comments)
		w.Write(js)
	}
}

func handleLike(w http.ResponseWriter, r *http.Request) {

}

func StartServer() {
	http.HandleFunc("/comment", handleComment)
	// GET will reutrn all comments for that video
	http.HandleFunc("/comment/video", handleCommentForVideo)
	// Get will reutrn all likes for Comment
	// Post will create a like
	// Put will update a like
	// http.HandleFunc("/like", handleLike)

	fmt.Printf("Starting server at port http://localhost:8080\n")
	if err := http.ListenAndServe(":8080", nil); err != nil {
			log.Fatal(err)
	}
}
