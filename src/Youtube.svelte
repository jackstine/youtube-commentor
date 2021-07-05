<script>
  import Comment from './Comment.svelte'
  import NewComment from './NewComment.svelte'
  import CommentAPI from './apis/CommentAPI'
  import util from './util'
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
  let data = {
    comments: []
  }
  $: comments = data.comments
  let repliesToComment = [
    cc('elliot', 'Hey love the show thanks'),
    cc('Susan', 'Writing random comments for filler'),
    cc('TimTheDrumMan', 'Thanks for the vid, love the content. Keep it up!')
  ]
  CommentAPI.getCommentsForVideo('id of the video').then(resp => {
    console.log(resp)
    data.comments = [...resp]
  })

  const handle_new_comment = function (e) {
    let new_comment = e.detail
    // TODO POST to API
    comments = [new_comment, ...comments]
//      topComment.before(generateCommentHTML(commentObj))
    console.log(comments)
  }

</script>


<main>
  <div>
    <NewComment on:comment={handle_new_comment} />
    {#each comments as c (c.comment.id)}
      <Comment comment_obj={c}/>
    {/each}
  </div>
</main>
