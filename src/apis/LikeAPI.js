import WebAPI from './WebAPI'

let endpoint = process.env.ENDPOINT

class CommentAPI extends WebAPI {
  constructor() {
    super({endpoint})
  }

  addLike(user, commentID, like, update) {
    return this.__post('like', {Update: update, Like: {User_id: user, Comment_id: commentID, Like: like}})
  }

  batchLikes(user, likeComments) {
    const updateLikes = likeComments.map(el => {
      return {
        Update: el.update,
        User_id: user,
        Comment_id: el.id,
        Like: el.like,
        VideoID: el.video_id,
        RootIsVideo: el.root_is_video,
        ParentID: el.parent_id
      }
    })
    return this.__post('likes', {UpdateLikes: updateLikes})
  }
}

export default new CommentAPI()
