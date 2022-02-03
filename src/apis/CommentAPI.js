import WebAPI from "./WebAPI";
import U from "../common/U"

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
      "Video_id": "video_id",
      "Likes": "likes",
      "Dislikes": "dislikes",
      "Like": "user_like",
      "Replies": "numOfReplies",
      "GivenName": "first_name",
      "FamilyName": "last_name",
      "ProfileLink": "profile"
    }
    this.current_user = null
  }

  transformCommentForChrome(comments) {
    let n = new Date().getTime() 
    for (let c of comments.Comments) {
      for (let t of Object.keys(this.trans)) {
        c[this.trans[t]] = c[t]
        delete c[t]
      }
      c.time_string = U.timeDifference(n, new Date(c.time_stamp))
    }
    return {
      data: comments.Comments.map(comment => {
        return {
          comment,
          replies: [],
        }
      }),
      nextToken: comments.ContinuationToken,
      nextTokenNum: comments.ContinuationTokenNum
    }
  }

  transformCommentForAPI(comments) {
    if (!Array.isArray(comments)) {
      comments = [comments]
    }
    let new_coments = JSON.parse(JSON.stringify(comments))
    // delete the comment items we are not sending to the API 
    for (let i =0; i < new_coments.length; i++) {
      delete new_coments[i].likes
      delete new_coments[i].dislikes
      delete new_coments[i].user_like
      delete new_coments[i].time_stamp
    }
    for (let c of new_coments) {
      for (let t of Object.keys(this.trans)) {
        c[t] = c[this.trans[t]]
        delete c[this.trans[t]]
      }
    }
    return new_coments
  }

  getComments (video_id, user_id, nextToken, nextTokenNum, options) {
    options = options || {video: "true", start: "0"}
    options.video = options.video || "true"
    options.start = options.start || "0"
    let dataForAPI = {comment: video_id, video: options.video, user: user_id, start: options.start}
    const hasNextTokenNum = nextTokenNum != null || nextTokenNum != undefined
    if (nextToken && hasNextTokenNum) {
      dataForAPI.token = nextToken
      dataForAPI.tokenNum = nextTokenNum
    }
    return this.__get('comment', dataForAPI).then(comments => {
      if (!comments?.Comments) {
        comments.Comments = []
      }
      if (comments){
        return this.transformCommentForChrome(comments)
      }
    }).catch(ex => {
      console.error(ex)
      return this.transformCommentForChrome(null)
    })
  }

  getReplies(comment_id, user_id, offset) {
    return this.__get('comment', {comment: comment_id, user: user_id, offset}).then(comments => {
      return this.transformCommentForChrome(comments)
    })
  }

  createComment(comment) {
    if (this.current_user) {
      comment.user = this.current_user.Email,
      comment = this.transformCommentForAPI(comment)[0]
      return this.__post('comment', comment).then(reply => {
        let CommentFromServer = {Comments: [{...reply, Likes: 0, Dislikes: 0, Like: 0}]}
        let c = this.transformCommentForChrome(CommentFromServer)
        let newSingleComment = c.data[0]
        this.__addUserToNewComment(newSingleComment)
        return newSingleComment
      })
    } else {
      return null
    }
  }

  updateComment(comment) {
    return this.__put('comment', {comment: comment}).then(comment => {
      return this.transformCommentForChrome([comment])
    })
  }

  addLikes(likes) {
    return this.__put('')
  }

  addCurrentUser(user) {
    this.current_user = user
  }

  getUnique (c) {
    return c.comment.id
  }
  __addUserToNewComment (full_comment) {
    const c = full_comment.comment
    const cu = this.current_user
    c.profile = cu.ProfileLink
    c.first_name = cu.GivenName
    c.last_name = cu.FamilyName
  }

}

export default new CommentAPI
