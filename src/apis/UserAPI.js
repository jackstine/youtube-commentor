import WebAPI from './WebAPI'

let endpoint = process.env.ENDPOINT

class UserAPI extends WebAPI {
  constructor() {
    super({endpoint})
  }

  getUser() {
    return this.__get("user")
  }
}

export default new UserAPI
