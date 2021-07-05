import WebAPI from "./WebAPI";
import util from '../util'
import _ from 'lodash'
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
    this.trans = {
      "Comment" : "comment",
      "Time_stamp": "time_stamp",
      "User_id": "user",
      "ID": "id",
      "Parent": "parent",
      "Video_id": "video_id"
    }
  }

  transformCommentForChrome(comments) {
    if (!comments) {
      // TODO return [] in the future...
      console.log('RETURN COMMENTS')
      return DEFAULT_COMMENTS
    }
    if (!Array.isArray(comments)) {
      comments = [comments]
    }
    // TODO need likes, dislikes, and user_like
    // TODO need to add in user to the API request
    // who is requesting the comments
    for (let c of comments) {
      for (let t of Object.keys(this.trans)) {
        c[this.trans[t]] = c[t]
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

  transformCommentForAPI(comments) {
    if (!Array.isArray(comments)) {
      comments = [comments]
    }
    // TODO need likes, dislikes, and user_like
    // TODO need to add in user to the API request
    // who is requesting the comments
    let new_coments = JSON.parse(JSON.stringify(comments))
    delete new_coments[0].likes
    delete new_coments[0].dislikes
    delete new_coments[0].user_like
    for (let c of new_coments) {
      for (let t of Object.keys(this.trans)) {
        c[t] = c[this.trans[t]]
        delete c[this.trans[t]]
      }
      // TODO need to add in the video ID
      c.Video_id='id of the video'
      // c.Parent=''
      c.Time_stamp = parseInt(c.Time_stamp/1000)
    }
    return new_coments
  }

  getCommentsForVideo (video_id) {
    return this.__get('comment/video', {video: video_id}).then(comments => {
      return this.transformCommentForChrome(comments)
    }).catch(ex => {
      console.error(ex)
      return this.transformCommentForChrome(null)
    })
  }

  getReplies(comment_id) {
    return this.__get('comment', {comment: comment_id})
  }

  createComment(comment) {
    comment = this.transformCommentForAPI(comment)[0]
    return this.__post('comment', comment).then(reply => {
      return this.transformCommentForChrome(reply)[0]
    })
  }

  updateComment(comment) {
    return this.__put('comment', {comment: comment}).then(comment => {
      return this.transformCommentForChrome(comment)
    })
  }
}

export default new CommentAPI
