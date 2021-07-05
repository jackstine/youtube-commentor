<script>
  import Comment from './Comment.svelte'
  import NewComment from './NewComment.svelte'
  import CommentAPI from './apis/CommentAPI'
  import util from './util'
  let data = {
    comments: []
  }
  $: comments = data.comments
  CommentAPI.getCommentsForVideo('id of the video').then(resp => {
    console.log(resp)
    data.comments = [...resp]
  })

  const handle_new_comment = function (e) {
    let new_comment = e.detail
    CommentAPI.createComment(new_comment.comment).then(resp => {
      console.log(resp)
      comments = [new_comment, ...comments]
      // TODO to save time make the UUID in the UI
      // topComment.before(generateCommentHTML(commentObj))
      console.log(comments)
    })
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
