let comment_chain = []
const time_regex = /((?:\d{1,3}:\d{1,2}:|\d{1,2}:)\d{1,2})/g
// https://regex101.com/r/sNf3ut/1
const video_time_reg = /(?:(\d{1,3}):(\d{1,2}):|(\d{1,2}):)(\d{1,2})/
// for the video https://regex101.com/r/AkPC4v/1

const UNIT_OF_TIMES_IN_SEOCONDS = [1, 60, 60*60]

const CHAIN_TYPE = {
  TEXT: 1,
  VIDEO_TIME: 2
}

const createTextChain = function (text) {
  return {
    type: CHAIN_TYPE.TEXT,
    text: text
  }
}

const getTotalSeconds = function (secondsToHours) {
  if (secondsToHours.length > 3) {
    // FUTURE we will have to deal with 
  }
  let totalSeconds = 0
  for (let i = 0; i < secondsToHours.length; i++) {
    if (i > 2) {
      // FUTURE need to get rid of if there is a mistake
      totalSeconds = 0
      break
    }
    const unit_of_time = secondsToHours[i]
    const current_unit_in_seconds = UNIT_OF_TIMES_IN_SEOCONDS[i]
    totalSeconds = totalSeconds + (parseInt(unit_of_time) * current_unit_in_seconds)
  }
  return totalSeconds
}

const createVideoTimeChain = function (text) {
  let match = text.match(video_time_reg)
  if (match) {
    let secondsToHours = match.reverse().filter(x => x)
    secondsToHours = secondsToHours.slice(0, secondsToHours.length-1)
    const totalSeconds = getTotalSeconds(secondsToHours) 
    return {
      type: CHAIN_TYPE.VIDEO_TIME,
      seconds: totalSeconds,
      text: text
    }
  } else {
    // FUTURE Not sure what to do
  }
}

class ChainReg extends RegExp {
  [Symbol.split](str, limit) {
    const result = RegExp.prototype[Symbol.split].call(this, str, limit);
    const chain = []
    for (let i = 0; i <result.length; i++) {
      const s = result[i]
      if ((i+1) % 2 === 1) {
        chain.push(createTextChain(s))
      } else {
        chain.push(createVideoTimeChain(s))
      }
    }
    return chain
  }
}

const buildChain = function (comment) {
  /**
   * text
   * video time
   */
  return comment.split(new ChainReg(time_regex))
}

module.exports = {
  buildChain,
  CHAIN_TYPE
}
