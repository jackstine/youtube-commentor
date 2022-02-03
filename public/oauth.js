const ACTIONS = {
  GET_AUTH_TOKEN: "GET_AUTH_TOKEN",
  GET_PROFILE_INFO: "GET_PROFILE_INFO",
  CLEAR_AUTH_TOKENS: "CLEAR_AUTH_TOKENS",
  GET_ACOUNTS: "GET_ACOUNTS",
  LOADING: "LOADING"
}

const Tabs = {
  createNewTabObject: function (id) {
    return {
      tabId: id,
      port: null,
      initialize: async function() {
        this.ACTION_TO_FUNC = {
          [ACTIONS.GET_AUTH_TOKEN]: this.getAuthToken.bind(this),
          [ACTIONS.GET_PROFILE_INFO]: this.getProfileInfo.bind(this),
          [ACTIONS.CLEAR_AUTH_TOKENS]: this.clearAuthTokens.bind(this),
          [ACTIONS.GET_ACOUNTS]: this.getAccounts.bind(this),
        }
        this.port = chrome.tabs.connect(this.tabId)
        this.port.onMessage.addListener(this.onMessage.bind(this))
        this.port.onDisconnect.addListener(() => {
          this.port = null
          delete globalData.tabs[this.tabId]
        })
      },
      onMessage(m) {
        let func = this.ACTION_TO_FUNC[m.action]
        if (func) {
          func(m)
        }
      },
      getAuthToken(message) {
        identity.getAuthToken(message.data).then(res => {
          this._postMessage({action: ACTIONS.GET_AUTH_TOKEN, data: {authToken: res}})
        })
      },
      getProfileInfo(message) {
        identity.getProfileInfo().then(res => {
          this._postMessage({action: ACTIONS.GET_PROFILE_INFO, data: {userInfo: res}})
        })
      },
      clearAuthTokens(message) {
        identity.clearAllAuthTokens().then(res => {
          this._postMessage({action: ACTIONS.CLEAR_AUTH_TOKENS})
        })
      },
      getAccounts(message) {
        identity.getAccounts().then(res => {
          this._postMessage({action: ACTIONS.GET_ACOUNTS, data: res})
        })
      },
      sendLoadingStatus() {
        this._postMessage({action: ACTIONS.LOADING})
      },
      _postMessage(message) {
        if (this.port) {
          this.port.postMessage(message)
        }
      }
    }
  }
}

const globalData = {
  tabs: {},//
}

const identity = {
  getAuthToken: function (data) {
    return new Promise((res, rej) => {
      chrome.identity.getAuthToken(data, function(token) {
        res(token)
      });
    })
  },
  getProfileInfo: function () {
    return new Promise((res, rej) => {
      chrome.identity.getProfileUserInfo(null, (userInfo) => {
        res(userInfo)
      })
    })
  },
  clearAllAuthTokens: function () {
    return new Promise((res, rej) => {
      chrome.identity.clearAllCachedAuthTokens(() => {
        res()
      })
    })
  },
  getAccounts: function () {
    return new Promise((res, rej) => {
      chrome.identity.getAccounts((resp) => {
        res(resp)
      })
    })
  }
}



const tabs = {
  setOnCreated: function (action) {
    chrome.tabs.onCreated.addListener(action)
  },
  setOnUpdated: function (action) {
    chrome.tabs.onUpdated.addListener(action)
  },
  getCurrentTab: async function () {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  },
  connectToTab: async function (tabId) {
    return chrome.tabs.connect(tabId)
  }
}


const contentScript = {
  sendMessage: (message, cb) => {
    tabs.getCurrentTab().then(tab => {
      chrome.tabs.sendMessage(tab.id, message, (message) => {cb(message, tab)})
    })
  },
  sendToken: async (cb) => {
    let token = await getAuthToken()
    contentScript.sendMessage(token, cb)
  },
  connectToContentScript: () => {

  }
}

const createTabObject = function (message) {
  let tabId = message.id
  const theTabAlreadyExists = globalData.tabs[tabId]
  if (!theTabAlreadyExists) {
    const tab = Tabs.createNewTabObject(tabId)
    globalData.tabs[tabId] = tab
    tab.initialize()
  } else {

  }
}
chrome.runtime.onConnect.addListener((message, sender, sendResponse) => {
  createTabObject(message.sender.tab)
})

tabs.setOnUpdated((tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading") {
    const tabObj = globalData.tabs[tabId]
    if (tabObj) {
      tabObj.sendLoadingStatus()
    }
  }
})