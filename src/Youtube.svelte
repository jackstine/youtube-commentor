<script>
  import Comment from './Comment.svelte'
  import NewComment from './NewComment.svelte'
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

  let repliesToComment = [
    cc('elliot', 'Hey love the show thanks'),
    cc('Susan', 'Writing random comments for filler'),
    cc('TimTheDrumMan', 'Thanks for the vid, love the content. Keep it up!')
  ]
  
  let comments = [
    cc('james', 'hello'),
    cc('sarah', 'I can comment'),
    cc('jim', 'we can comment too')
  ]

  let topCommentId = comments[0].id

  const handle_new_comment = function (e) {
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
