const createUserAuth = function () {
  return {
    secondAttempt: false,
    checkIfUserHasLoggedIn: async function () {
      const authToken = await this.__getAuthToken()
      if (authToken) {
        return true
      } else {
        return false
      }
    },
    logUserIn: async function () {
      const authToken = await this.__getAuthToken(true)
      if (authToken) {
        return authToken
      } else {
        return false
      }
    },
    __getAuthToken: async function (interactive) {
      const authToken = await new Promise((res, rej) => {
        try {
          chrome.identity.getAuthToken({interactive}, function(token) {
            res(token)
          });
        } catch (ex) {
          res({})
        }
      })
      return authToken
    }
  }
}

module.exports = {
  createUserAuth
}
