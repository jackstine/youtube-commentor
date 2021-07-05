import WebAPI from "./WebAPI";

let endpoint = process.env.ENDPOINT

class CommentAPI extends WebAPI {
  constructor() {
    super({endpoint})
  }

  transformComment(comments) {
    if (!comments) {
      return []
    }
    if (!Array.isArray(comments)) {
      comments = [comments]
    }
    let trans = {
      "Comment" : "comment",
      "Time_stamp": "time_stamp",
      "User_id": "user",
      "ID": "id",
      "Parent": "parent",
      "Video_id": "video_id"
    }
    // TODO need likes, dislikes, and user_like
    // TODO need to add in user to the API request
    // who is requesting the comments
    for (let c of comments) {
      for (let t of Object.keys(trans)) {
        c[trans[t]] = c[t]
        delete c[t]
      }
    }
    return comments.map(comment => {
      return {
        comment,
        replies: []
      }
    })
  }

  getCommentsForVideo (video_id) {
    return this.__get('comment/video', {video: video_id}).then(comments => {
      return this.transformComment(comments)
    })
  }

  getReplies(comment_id) {
    return this.__get('comment', {comment: comment_id})
  }

  createComment(comment) {
    return this.__post('comment', {comment: comment})
  }

  updateComment(comment) {
    return this.__put('comment', {comment: comment})
  }
}

export default new CommentAPI
