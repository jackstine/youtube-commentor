
const ACTIONS = {
  CONNECT: "CONNECT",
  GET_AUTH_TOKEN: "GET_AUTH_TOKEN",
  GET_PROFILE_INFO: "GET_PROFILE_INFO",
  CLEAR_AUTH_TOKENS: "CLEAR_AUTH_TOKENS",
  GET_ACCOUNTS: "GET_ACCOUNTS",
  LOADING: "LOADING"
}

/**
 * dispatchEvent
 * @param {*} evnetName 
 * @param {*} data 
 */
const de = function (evnetName, data){
  const event = new Event(evnetName)
  event.data = data
  document.dispatchEvent(event)
}

const createChromeExtensionConnection = function (options) {
  return {
    __port: null,
    ACTIONS: null,
    __connected: false,
    __connecting: false,
    onReceiveLoadingEvent: options?.onReceiveLoadingEvent,
    initialize: function () {
      this.ACTIONS = {
        [ACTIONS.GET_AUTH_TOKEN]: this.onReceiveAuthToken.bind(this),
        [ACTIONS.GET_PROFILE_INFO]: this.onReceiveProfileInfo.bind(this),
        [ACTIONS.CLEAR_AUTH_TOKENS]: this.onRecieveClearAuthTokens.bind(this),
        [ACTIONS.GET_ACCOUNTS]: this.onReceiveAccounts.bind(this),
        [ACTIONS.LOADING]: this.__recievedTabIsLoading.bind(this)
      }
      chrome.runtime.onConnect.addListener((p) => {
        this.__connecting = false 
        // wait for the onConnect to occur
        // then we can proceed with other functions
        this.__port = p
        const port = p
        if (port) {
          port.onMessage.addListener(this.onMessage.bind(this))
          port.onDisconnect.addListener(this.onDisconnect.bind(this))
          this.connected = true
          de(ACTIONS.CONNECT)
        }
      });
      this._connect()
    },
    _connect: function () {
      this.__connecting = true
      chrome.runtime.connect();
    },
    createSendActionOnce (options) {
      const that = this
      return this.createOnceEvent(options.eventName, {func: () => {
        that.sendAction({action: options.eventName, data: options.data})
      }})
    },
    createOnceEvent(eventName, options) {
      options = options || {}
      return new Promise((res, rej) => {
        // returns a promise that will
        // add eventListener that resolves or rejects
        // if options has func, call func
        // if func fails, it rejects
        document.addEventListener(eventName, (e) => {
          try {
            const data = e.data
            if (!data)  {
              res()
            } else if (data.error) {
              rej(data.error)
            } else {
              res(data.data)
            }
          } catch (ex) {
            rej(ex)
          }
        }, {once: true})
        // after creating event run the function to send the action
        if (options.func) {
          try { 
            options.func()
          } catch (ex) {
            rej(ex)
          }
        }
      }).catch(console.error)
    },
    onDisconnect(message) {
      this.__port = null
      this.connected = false
    },
    sendAction(actionMessage) {
      this._postMessage(actionMessage)
    },
    onMessage (m) {
      const func = this.ACTIONS[m.action]
      if (func) {
        func(m)
      }
    },
    onReceiveAuthToken(message) {
      de(ACTIONS.GET_AUTH_TOKEN, message)
    },
    onReceiveProfileInfo(message) {
      de(ACTIONS.GET_PROFILE_INFO, message)
    },
    onRecieveClearAuthTokens(message) {
      de(ACTIONS.CLEAR_AUTH_TOKENS, message)
    },
    onReceiveAccounts(message) {
      de(ACTIONS.GET_ACCOUNTS, message)
    },
    __recievedTabIsLoading(message) {
      this.onReceiveLoadingEvent(message)
    },
    getAuthToken() {
      return this.createSendActionOnce({eventName: ACTIONS.GET_AUTH_TOKEN, data: {interactive: true}})
    },
    hasAuthToken() {
      return this.createSendActionOnce({eventName: ACTIONS.GET_AUTH_TOKEN, data: {interactive: false}})
    },
    getProfileInfo() {
      return this.createSendActionOnce({eventName: ACTIONS.GET_PROFILE_INFO})
    },
    clearAuthTokens() {
      return this.createSendActionOnce({eventName: ACTIONS.CLEAR_AUTH_TOKENS})
    },
    getAccounts() {
      return this.createSendActionOnce({eventName: ACTIONS.GET_ACCOUNTS})
    },
    _postMessage(actionMessage) {
      if (this.__port && this.connected) {
        this.__port.postMessage(actionMessage)
      } else {
        if (this.__connecting) {
          setTimeout(() => {
            this._postMessage(actionMessage)
          }, 200)
        } else {
          this._connect()
          this.createOnceEvent(ACTIONS.CONNECT).then(resp => {
            this._postMessage(actionMessage)
          })
        }
      }
    }
  }
}

export default {
  create: createChromeExtensionConnection
}
