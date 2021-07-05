<script>
  import NewComment from "./NewComment.svelte";
  import CommentAPI from './apis/CommentAPI'

  let show_new_comment_section = false
  let show_reply_comments = false
  let current_time = new Date().getTime()

  const LIKES ={
    LIKE: 1,
    DISLIKE:2,
    NOTHING: 0
  }

  export let comment_obj;
  $: comment = comment_obj.comment;
  $: replies = [...comment_obj.replies];
  $: likes = comment_obj.comment.likes
  $: dislikes = comment_obj.comment.dislikes
  $: user_like = comment_obj.comment.user_like


  const on_show_reply_comments = function (comment_id) {
    show_reply_comments = !show_reply_comments
    // TODO call api to get the replies
  }

  const on_dislike = function () {
    if (user_like === LIKES.LIKE) {
      comment_obj.comment.likes--
    }
    if (user_like === LIKES.NOTHING || user_like === LIKES.LIKE) {
      // TODO make call to api to store like
      comment_obj.comment.dislikes++
      comment_obj.comment.user_like = LIKES.DISLIKE
    }
  }

  const on_like = function () {
    if (user_like === LIKES.DISLIKE) {
      comment_obj.comment.dislikes--
    }
    if (user_like === LIKES.NOTHING || user_like === LIKES.DISLIKE) {
      // TODO make call to api to store like
      comment_obj.comment.likes++
      comment_obj.comment.user_like = LIKES.LIKE
    }
  }

  const on_reply = function () {
    show_new_comment_section = true
  }

  const on_new_reply= function (e) {
    let reply = e.detail
    reply.comment.parent = comment.id
    CommentAPI.createComment(reply.comment).then(comment => {
      console.log(comment)
      comment_obj.replies = [comment,...comment_obj.replies]
      show_reply_comments = true
      show_new_comment_section = false
    })
  }
</script>

<main>
  <img
    id="img" alt="Liam Cloes" height="40" width="40"
    src="https://yt3.ggpht.com/ytc/AKedOLTD3_5rjgNdFqLvGmIjfS44_uqdjjwdRYMkAPfWKA=s48-c-k-c0x00ffffff-no-rj"
  />

  <section class="username">
    {comment.user}
    <span class="time">{current_time - comment.time_stamp}</span>
  </section>

  <section class="comment">{comment.comment}</section>

  <section class="controls">
    <span on:click={on_like}>
      <img class="thumbs" alt="thumbs up" src="/outline-cleaned.svg" />
      {likes}
    </span>
    <span on:click={on_dislike}>
      <img class="thumbs down" alt="thumbs down" src="/outline-cleaned.svg" />
      {dislikes}
    </span>
    <span class="reply-btn" on:click={on_reply}>Reply</span>
  </section>

  <section class="comments">
    <div class="toggle-btn" on:click={() => on_show_reply_comments(comment.id)} style="font-size: 1rem" >
      View replies (number)
    </div>
    <div>
      {#if show_new_comment_section}
        <NewComment on:comment={on_new_reply} />
      {/if}
      {#if show_reply_comments}
        {#each replies as c (c.comment.id)}
          <svelte:self comment_obj={c}/>
        {/each}
      {/if}
    </div>
  </section>
</main>

<style>
  main {
    margin-bottom: 1em;
    display: grid;
    grid-template-columns: min-content 1fr;
    grid-template-areas:
      'img username .'
      'img comment comment'
      '. controls .'
      '. comments comments';
  }

  div.toggle-btn {
    color: blue;
  }

  span.reply-btn {
    text-transform: uppercase;
    font-weight: 600;
    font-size: 0.9em;
    color: rgb(80, 80, 80);
  }

  section.username {
    grid-area: username;
    font-weight: bold;
  }

  span.time {
    font-size: 0.9em;
    font-weight: normal;
  }

  section.controls {
    grid-area: controls;
  }

  section.controls > * {
    cursor: pointer;
    margin-right: 2em;
  }

  section.comment {
    grid-area: comment;
  }

  main > img {
    grid-area: img;
    border-radius: 50%;
    margin-right: 16px;
  }

  img.thumbs {
    height: 1em;
  }

  img.thumbs.down {
    transform: rotate(180deg);
  }

  section.comments {
    grid-area: comments;
  }
</style>

