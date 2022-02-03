<script>
	import { createEventDispatcher } from 'svelte';
import LikeSvg from './LikeSVG.svelte';
  import LikeSVG from './LikeSVG.svelte'
	const dispatch = createEventDispatcher();

  export let comment;
  const LIKES = {
    LIKE: 1,
    DISLIKE:2,
    NOTHING: 0
  }
  export let has_current_user;
  
  $: likes = comment.likes
  $: dislikes = comment.dislikes
  $: user_like = comment.user_like

  const handleBatchLike = function (comment, update) {
    let commentUpdate = {
      id: comment.id,
      like: comment.user_like,
      update
    }
    dispatch('batchLikes', commentUpdate)
  }


  const on_dislike = function () {
    if (has_current_user) {
      let update = true
      if (user_like === LIKES.NOTHING) {
        update = false 
      }
      if (user_like === LIKES.LIKE) {
        comment.likes--
      }
      if (user_like === LIKES.NOTHING || user_like === LIKES.LIKE) {
        comment.dislikes++
        comment.user_like = LIKES.DISLIKE
        handleBatchLike(comment, update)
      }
    }
  }

  const on_like = function () {
    if (has_current_user) {
      let update = true
      if (user_like === LIKES.NOTHING) {
        update = false 
      }
      if (user_like === LIKES.DISLIKE) {
        comment.dislikes--
      }
      if (user_like === LIKES.NOTHING || user_like === LIKES.DISLIKE) {
        comment.likes++
        comment.user_like = LIKES.LIKE
        handleBatchLike(comment, update)
      }
    }
  }
</script>

<main>
  <span class="thumb" alt="thumbs up" on:click={on_like}>
    <LikeSvg down={false}/>
    <span class="like-numbers">
      {likes}
    </span>
  </span>
  <span class="thumb" alt="thumbs down" on:click={on_dislike}>
    <LikeSvg down={true}/>
    <span class="like-numbers">
      {dislikes}
    </span>
  </span>
</main>

<style>
span.like-numbers {
  margin-left: 4px;
}
span.thumb {
  float: left;
  display: inline;
}
</style>
