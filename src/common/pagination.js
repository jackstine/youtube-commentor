export default class Pagination {
  /**
   * the fetch is an async call to get data
   * @param {*} fetch 
   * @param {*} numberOnPage  -- 25 this should be the limit on the server
   * @param {*} maxNumberOfEntries 
   */
  constructor(fetch, numberOnPage, {postUpdateData, getUnique}) {
    this.data =[]
    this.fetch = fetch
    this.numberOnPage = numberOnPage
    this.postUpdateData = postUpdateData
    this.getUnique = getUnique 
    this.hasHitAllData = false
    this.currentOffset = 0
    this.nextToken = null
    this.nextTokenNum = null
    this.setOfData = new Set()
  }
  getData(dataForFetch) {
    return new Promise(async (resolver, rejector) => {
      let added_data = false
      try {
        if (!this.hasHitAllData) {
          let data = await this.fetch(dataForFetch, this.nextToken, this.nextTokenNum, this.currentOffset)
          // FUTURE return is last from the data
          if (data) {
            added_data = this.addNewData(data.data)
            const previousToken = this.nextToken
            const number_retrieved = data.data.length
            this.nextToken = data.nextToken
            this.nextTokenNum = data.nextTokenNum
            const has_no_previous_token = previousToken === null
            const next_token_is_still_zero = this.nextTokenNum === 0
            if ((has_no_previous_token && next_token_is_still_zero) || previousToken === this.nextToken) {
              if (this.currentOffset === 0) {
                this.currentOffset = number_retrieved 
              } else {
                this.currentOffset = this.currentOffset + number_retrieved
              }
            } else {
              this.currentOffset = 0
            }
          } else {
            this.hasHitAllData = true
          }
        }
        resolver({
          data: this.data,
          added_data 
        })
      } catch (ex) {
        rejector(ex)
      }
    }).then(resp => {
      this.postUpdateData()
      return resp
    })
  }

  addNewData(data) {
    const dataToAdd = this.__getUniqueDataToAdd(data)
    if (dataToAdd.length > 0) {
      this.data.push.apply(this.data, dataToAdd)
      return true // added new data
    } else {
      return false // did not add new data
    }
  }

  addToData(data) {
    // do not need to get the array, just want to push it to the top
    this.__getUniqueDataToAdd([data])
    this.data = [data, ...this.data]
  }

  /**
   * gets the unique data in data.
   * Adds the data that is returned to the setOfData
   * @param {*} data 
   * @returns 
   */
  __getUniqueDataToAdd(data) {
    const dataToAdd = []
    for(let d of data) {
      let uniqueness = this.getUnique(d)
      if (!this.setOfData.has(uniqueness)) {
        dataToAdd.push(d)
        this.setOfData.add(uniqueness)
      }
    }
    return dataToAdd
  }
}
