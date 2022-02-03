<script>
  import Comment from './Comment.svelte'
  import NewComment from './NewComment.svelte'
  import CommentAPI from '../apis/CommentAPI'
  import UserAPI from '../apis/UserAPI'
  import LikeAPI from '../apis/LikeAPI';
	import { onMount, onDestroy } from 'svelte';
  import Pagination from '../common/pagination'
  import UserLogin from './UserLogin.svelte';
  import Header from './Header.svelte';
  import Support from './Support.svelte'
  import {canGetAuthToken, showPopupLogin} from '../apis/WebAPI'

  // export let conn;
  export let video_id;
  export let is_dark_mode;

  const TIME_TO_REQUEST_NEW_COMMENTS = 500;
  const TIME_TO_REQUEST_WHEN_NO_NEW_DATA = 7000;

  let YTdata = {
    comments: [],
    batched_likes: {},
    likesInterval: null,
    thresholdNumber: 5, // number of elements before the threshold kicks in
    locked: false,
    batched_likes_lock: false,
    pagination: null,
    current_user: null,
    comment_set: new Set(),
    user_has_chosen_to_not_login: false
  }
  let last_element = null
  let loginTries = 0
  const BATCH_SYNC_TIME = 4
  const COMMENT_API_LIMIT = 25

  $: comments = YTdata.comments
  $: current_user = YTdata.current_user 
  $: current_user_email = YTdata.current_user?.Email
  $: chose_not_to_login = YTdata.user_has_chosen_to_not_login

  const logUserIn = async function () {
    const gotAuthToken = await showPopupLogin()
    if (gotAuthToken) {
      onUserHasLoggedIn() 
    } else {
      loginTries++
    }
  }

  const updateRootComments = function (d, nextToken, nextTokenNum, current_offset) {
    const options = {video: "true", start: current_offset.toString()}
    return CommentAPI.getComments(video_id, YTdata.current_user.Email, nextToken, nextTokenNum, options)
  }

  const postUpdateData = function () {
    YTdata.comments = [...YTdata.pagination.data] 
  }

  const setupScroll = function () {
    if (!YTdata.onScrollEvent) {
      let pagination = YTdata.pagination
      let thresholdNumber = YTdata.thresholdNumber

      const onScrollEvent =  function() {
        if (!YTdata.locked && last_element) {
          let heightOfScreen = window.innerHeight
          let rect = last_element.getBoundingClientRect()
          let currentY = rect.y
          let heightOfElement = rect.height
          let threshold = heightOfElement * thresholdNumber
          let heightToElement = currentY - heightOfScreen + heightOfElement
          if (heightToElement < threshold) {
            YTdata.locked = true
            pagination.getData().then(resp => {
              let timeout_time = TIME_TO_REQUEST_NEW_COMMENTS
              if (!resp.added_data) {
                timeout_time = TIME_TO_REQUEST_WHEN_NO_NEW_DATA
              }
              setTimeout(() => {
                YTdata.locked = false
              }, timeout_time)
            }).catch(ex => {
              console.error(ex)
            })
          }
        }
      }

      YTdata.onScrollEvent = onScrollEvent
      window.addEventListener('scroll', onScrollEvent)
    }
  }

  const constructCommentPagination = function () {
    let pagination = new Pagination(updateRootComments, COMMENT_API_LIMIT, {postUpdateData, getUnique: CommentAPI.getUnique})
    YTdata.pagination = pagination
    pagination.getData().then(resp => {
      setupScroll()
    })
  }

  const setLikesInterval = function () {
    YTdata.likesInterval = setInterval(() => {
      if (!YTdata.batched_likes_lock) {
        let keys = Object.keys(YTdata.batched_likes)
        if (keys.length > 0) {
          YTdata.batched_likes_lock = true
          let likes = []
          for (let k of keys) {
            likes.push(YTdata.batched_likes[k])
          }
          LikeAPI.batchLikes(current_user_email, likes).then(resp => {
            for (let l of likes) {
              delete YTdata.batched_likes[l.id]
            }
            setTimeout(() => {
              YTdata.batched_likes_lock = false
            }, 200)
          })
        }
      }
    }, 1000 * BATCH_SYNC_TIME)
  }

  const onUserHasLoggedIn = function () {
    UserAPI.getUser().then(resp => {
      YTdata.current_user = resp
      CommentAPI.addCurrentUser(resp)
      const user_is_authenticated = true
      if (user_is_authenticated) {
        constructCommentPagination()
        setLikesInterval()
      }
      // if the user is not authenticated, then we do nothing
    })
  }

  onMount(async () => {
    const has_auth_token= await canGetAuthToken()
    if (has_auth_token) {
      onUserHasLoggedIn()
    } else {
      YTdata.user_has_chosen_to_not_login = true
    }
  })

  onDestroy(() => {
    if (YTdata.likesInterval) {
      clearInterval(YTdata.likesInterval)
    }
    if (YTdata.onScrollEvent) {
      window.removeEventListener('scroll', YTdata.onScrollEvent)
    }
  })

  const handle_new_comment = function (e) {
    let new_comment = e.detail
    CommentAPI.createComment(new_comment.comment).then(returned_comment => {
      YTdata.pagination.addToData(returned_comment)
      YTdata.comments = [returned_comment, ...comments]
    })
  }

  const handle_batch_likes = function (e) {
    let like = e.detail
    let id = like.id
    YTdata.batched_likes[id]= like
  }
</script>


<main>
  <div>
    <Header/>
    {#if current_user}
      <Support />
      <NewComment
        on:comment={handle_new_comment}
        current_user={current_user}
        parent_comment={undefined}
        video_id={video_id}
      />
      {#each comments as c,i (c.comment.id)}
        {#if i == comments.length - 1}
          <div bind:this={last_element}>
            <Comment 
              bind:this={last_element}
              on:batchLike={handle_batch_likes}
              comment_obj={c}
              video_id={video_id}
              is_dark_mode={is_dark_mode}
              current_user={current_user}
            />
          </div>
          {#if comments.length > 10}
            <Support/>
          {/if}
        {:else}
          <Comment
            on:batchLike={handle_batch_likes}
            comment_obj={c}
            current_user={current_user}
            video_id={video_id}
            is_dark_mode={is_dark_mode}
          />
        {/if}
      {/each}
    {:else}
      <UserLogin 
        on:login={logUserIn}
        enableHaveNotRecievedUserInformation={chose_not_to_login}
        chose_to_not_login={chose_not_to_login}
        loginAttempt={loginTries}
      />
    {/if}
  </div>
</main>
