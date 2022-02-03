<script>
	import { createEventDispatcher, onMount } from 'svelte';
  import NewComment from "./NewComment.svelte";
  import CommentChain from "./CommnetChain.svelte"
  import LikeButtons from "./LikeButtons.svelte";
  import CommentAPI from '../apis/CommentAPI'
  import Pagination from "../common/pagination";

	const dispatch = createEventDispatcher();
  
  let show_new_comment_section = false
  let show_reply_comments = false
  let pagination = null
  const LIMIT = 50
  let lock = false


  export let comment_obj;
  export let current_user;
  export let video_id;
  export let is_dark_mode;

  $: comment = comment_obj.comment;
  $: replies = [...comment_obj.replies];
  $: num_of_replies = comment_obj.comment.numOfReplies
  $: show_view_replies = comment_obj.comment.numOfReplies > 0
  $: has_current_user = current_user;
  $: current_user_email = current_user?.Email;

/**
 * I need the y position of the last comment
 * i can use that with the scrolling to get the the current height
 * bind:this={myElement} .  to pass the reference
 */
  const getMoreComments = function (data, nextToken, nextTokenNum) {
    return CommentAPI.getComments(data.comment_id, current_user_email, nextToken, nextTokenNum, {video: "false"})
  }

  const on_receive_more_replies = function () {
    comment_obj.replies = [...pagination.data]
    setTimeout(() => {
      lock = false
    }, 200)
  }

  onMount(() => {
    pagination = new Pagination(getMoreComments, LIMIT, {postUpdateData: on_receive_more_replies, getUnique: CommentAPI.getUnique})
  })  

  const on_show_reply_comments = function () {
    show_reply_comments = !show_reply_comments
    if (comment_obj.replies.length === 0) {
      pagination.getData({comment_id: comment.id})
    }
  }

  const on_reply = function () {
    show_new_comment_section = !show_new_comment_section
  }

  const on_new_reply= function (e) {
    let reply = e.detail
    reply.comment.parent = comment.id
    CommentAPI.createComment(reply.comment).then(comment => {
      // always set the show_reply_comments to false so that the comments will show
      // when we call the function
      show_reply_comments = false
      on_show_reply_comments()
      pagination.addToData(comment)
      comment_obj.replies = [comment,...comment_obj.replies]
      if (num_of_replies) {
        comment_obj.comment.numOfReplies = comment_obj.comment.numOfReplies + 1
      } else {
        comment_obj.comment.numOfReplies = 1
      }
      show_new_comment_section = false
    })
  }

  const on_view_more_replies = function (comment_id) {
    pagination.getData({comment_id})
  }

  const onBatchLikes = function (e) {
    if (has_current_user) {
      let updateLike = e.detail
      if (comment.video_id) {
        updateLike.video_id = comment.video_id
        updateLike.root_is_video = true
      } else if (comment.parent) {
        updateLike.parent_id = comment.parent
      }
      dispatch('batchLike', updateLike)
    }
  }

  const on_new_cancel = function () {
    show_new_comment_section = false
  }

</script>

<main>
  <img
    id="img" alt="Liam Cloes" height="40" width="40"
    src={comment.profile}
  />

  <section class="username">
    {comment.first_name + " " + comment.last_name}
    <span class="time" class:light-mode="{!is_dark_mode}" class:dark-mode="{is_dark_mode}">{comment.time_string}</span>
  </section>

  <section class="comment">
    <CommentChain comment={comment.comment} video_id={video_id}/>
  </section>

  <section class="controls" class:light-mode="{!is_dark_mode}" class:dark-mode="{is_dark_mode}">
    <div class="like-buttons">
      <LikeButtons on:batchLikes={onBatchLikes} comment={comment_obj.comment} has_current_user={has_current_user}/>
    </div>
    {#if has_current_user}
      <span class="reply-btn" on:click={on_reply}>Reply</span>
    {/if}
  </section>

  <section class="comments">
    {#if show_view_replies}
      {#if !show_reply_comments}
        <div class="toggle-btn" on:click={() => on_show_reply_comments()} >
          View replies ({num_of_replies})
        </div>
      {:else}
        <div class="toggle-btn" on:click={() => on_show_reply_comments()} >
          Hide replies
        </div>
      {/if}
    {/if}
    <div>
      {#if show_new_comment_section}
        <NewComment
          on:cancel={on_new_cancel}
          on:comment={on_new_reply}
          current_user={current_user}
          video_id={video_id}
          parent_comment={comment.id}
        />
      {/if}
      {#if show_reply_comments}
        {#each replies as c,i (c.comment.id)}
          <svelte:self 
            on:batchLike={onBatchLikes}
            comment_obj={c}
            current_user={current_user}
            video_id={video_id}
          />
          {#if (i === replies.length - 1) && (i + 1) < num_of_replies}
            <div on:click={() => on_view_more_replies(comment.id)}>View More Replies {num_of_replies} : {i}</div> 
          {/if}
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
    color: rgb(62, 166, 255);
    font-size: 1.5rem;
    margin: 0 0 10px 0;
  }

  .like-buttons {
    float: left;
    display: inline;
  }

  span.reply-btn {
    text-transform: uppercase;
    font-weight: 600;
    font-size: 0.9em;
  }

  section.username {
    grid-area: username;
    font-weight: bold;
  }

  span.time {
    font-size: 0.9em;
    font-weight: normal;
  }

  span.time.dark-mode {
    color: rgb(170, 170, 170);
  }
  span.time.light-mode {
    color: rgb(96, 96, 96);
  }
  section.controls {
    grid-area: controls;
  }

  section.controls.dark-mode {
    color: rgb(170, 170, 170);
  }

  section.controls.light-mode {
    color: rgb(96, 96, 96);
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

  section.comments {
    grid-area: comments;
    margin-top: 10px;
  }
</style>

