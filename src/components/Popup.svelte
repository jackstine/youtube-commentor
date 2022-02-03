<script>
  import {onMount} from 'svelte'
  import UserLogin from './UserLogin.svelte';
  import Notes from './Notes.svelte'
  import Logo from './Logo.svelte'
  import {createUserAuth} from '../chrome/userAuth'

  const userAuth = createUserAuth()
  let hasLoggedIn = false
  let loginTries = 0

  onMount(async () => {
    hasLoggedIn = await userAuth.checkIfUserHasLoggedIn()
  })

  const logUserIn = async function () {
    let loggedIn = await userAuth.logUserIn()
    if (!loggedIn) {
      loginTries += 1
    }
    hasLoggedIn = loggedIn
  }
</script>
<main>
  <div class="popup-space">
    <Logo />
    <UserLogin
      on:login={logUserIn}
      enableHaveNotRecievedUserInformation={!hasLoggedIn}
      chose_to_not_login={!hasLoggedIn}
      loginAttempt={loginTries}
    />
    <Notes/>
  </div>
</main>
<style>
.popup-space {
  width: fit-content;
  background-color: white;
  color:black;
  font-size: medium;
  padding: 0 20px 0 20px;
}
</style>