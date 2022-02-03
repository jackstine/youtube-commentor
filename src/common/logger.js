const logger = {
  debug: true,
  log: function () {
    if (this.debug) {
      console.log(arguments)
    }
  }
}

export default logger
