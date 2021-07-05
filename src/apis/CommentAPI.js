import WebAPI from "./WebAPI";
import util from '../util'
let cc = function (user, comment) {
  return {
    comment: {
      user, comment,
      time_stamp: new Date().getTime(),
      id: util.makeid(12),
      likes: 13,
      dislikes: 3,
      user_like: 0
    },
    replies: []
  }
}

let DEFAULT_COMMENTS = [
  cc('james', 'hello'),
  cc('sarah', 'I can comment'),
  cc('jim', 'we can comment too')
]

let endpoint = process.env.ENDPOINT

class CommentAPI extends WebAPI {
  constructor() {
    super({endpoint})
  }

  transformComment(comments) {
    if (!comments) {
      // TODO return [] in the future...
      console.log('RETURN COMMENTS')
      return DEFAULT_COMMENTS
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
    }).catch(ex => {
      console.error(ex)
      return this.transformComment(null)
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
