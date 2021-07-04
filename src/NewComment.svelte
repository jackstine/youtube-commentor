<script>
  /**
   * events
   *  newComment -- creates a new comment 
   * */

	import { createEventDispatcher } from 'svelte';
  import {makeid} from './util'
	const dispatch = createEventDispatcher();

  let comment = ''
  const add_comment = function (e) {
    let comment_obj ={
      comment:{
        time_stamp: new Date().getTime(),
        user: 'byte_of_code',
        comment,
        id: makeid(10),
        likes: 0,
        dislikes: 0,
        user_like: 0
      },
      replies: []
    }
    console.log(comment_obj)
    dispatch('comment', comment_obj)
    // TODO uncomment
    // comment=''
  }
  
</script>

<main>
  <img alt="Liam Cloes" height="40" width="40"
    src="https://yt3.ggpht.com/ytc/AKedOLTD3_5rjgNdFqLvGmIjfS44_uqdjjwdRYMkAPfWKA=s48-c-k-c0x00ffffff-no-rj"
  />

  <div>
    <label for="newCommentYTC">Create New Comment</label>
    <input bind:value={comment} id="newCommentYTC" style="width: 300px" />
    <button on:click={() => comment = ''}>Cancel</button>
    <button id="addCommentYTC" on:click={add_comment} >Comment</button>
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
