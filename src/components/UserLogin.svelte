<script>
  import Support from './Support.svelte'
  import { createEventDispatcher, onMount} from 'svelte';
	const dispatch = createEventDispatcher();

  export let enableHaveNotRecievedUserInformation;
  export let chose_to_not_login;
  export let loginAttempt;

  let disableLoginButton = false
  
  const enableLoginButton = function () {
    disableLoginButton = false
  }

  const logUserIn = function () {
    disableLoginButton = true
    dispatch('login')
  }

  $: loginAttempt, enableLoginButton();

</script>
<main>
  <div class="user-not-signed-in">
    <section class="user-not-signed-in">
      <h4>Thanks for downloading and installing the YT-Commenter Chrome Application</h4>
      {#if enableHaveNotRecievedUserInformation}
        <div class="header-div-info">
          <p class="header-info">We have not been able to retrieve your Google Identity yet. Click the button below and then accept the terms of service and log into the YT-Commenter Application</p>
        </div>
        {#if chose_to_not_login}
          <button 
            on:click={logUserIn}
            disabled={disableLoginButton}
            class="log-in-to-account-btn">
              Show Popup to Log In
          </button>
        {/if}
      {/if}
      <div class="end-notes">
        <p>Happy Commenting 😃</p>
      </div>
      <div>
        <p>For more information on the application see our <a href="https://ytcommenter.byteofcode.io/" target="_blank">site here</a></p>
      </div>
      <Support />
    </section>
  </div>
</main>
<style>
  .user-not-signed-in {
    width: 100vw;
    margin-bottom: 30px;
    text-align: center;
  }
  .header-div-info {
    max-width: 600px;
    margin: auto;
  }
  .header-info {
    margin-top: 10px;
    white-space: normal;
  }
  .end-notes {
    margin-top: 10px;
  }
  .log-in-to-account-btn {
    vertical-align: middle;
    border: 0px;
    background-color: cornflowerblue;
    color: white;
    padding: 10px;
    border-radius: 10px;
    font-weight: 650;
    cursor: pointer;
    margin-top: 10px;
  }
  .log-in-to-account-btn:hover {
    background-color: #0053e8;
  }
</style>