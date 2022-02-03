<script>
  /**
   * events
   *  newComment -- creates a new comment 
   * */

	import { createEventDispatcher, onMount} from 'svelte';
	const dispatch = createEventDispatcher();
  const ENTER_KEY = 13;
  
  export let current_user;
  export let video_id;
  export let parent_comment;

  $: profile = current_user?.ProfileLink
  $: comment_html_id = "newCommentYTC-" + (parent_comment ? parent_comment : "")

  onMount(() => {
    if (parent_comment) {
      setTimeout(() => {
        document.querySelector('#' + comment_html_id).focus()
      }, 100);
    }
  })

  let comment = ''
  const add_comment = function (e) {
    const trimmed_comment = comment.trim()
    if (trimmed_comment !== "") {
      let comment_obj ={
        comment:{
          time_stamp: new Date().getTime(),
          comment: trimmed_comment,
          likes: 0,
          dislikes: 0,
          user_like: 0,
          video_id: video_id
        },
        replies: []
      }
      dispatch('comment', comment_obj)
      comment = ''
    }
  }
 
  const onNewCommentKeyPress = function (e) {
    if (e.keyCode === ENTER_KEY) {
      add_comment()
    }
  }
  const onCancel = function () {
    comment = ''
    dispatch('cancel')
  }
</script>

<main>
  {#if profile}
    <img alt="Liam Cloes" height="40" width="40"
      src={profile}
    />
  {/if}

  <div>
    <label for={comment_html_id}>Create New Comment</label>
    <input
      type="text" spellcheck="true"
      bind:value={comment}
      id={comment_html_id}
      style="width: 300px"
      on:keypress={onNewCommentKeyPress}
    />
    <button on:click={onCancel}>Cancel</button>
    <button id={"add" + comment_html_id} on:click={add_comment} >Comment</button>
  </div>
</main>

<style>
  main {
    display: grid;
    grid-template-columns: min-content 1fr;
    grid-template-areas:
      'img comment';
  }

  img {
    grid-area: img;
    border-radius: 50%;
    margin-right: 16px;
  }
</style>
