import Youtube from './components/Youtube.svelte';
import youtubeContentScript from './content-script/youtubeContentScriptApp'
import {registerConnection} from './apis/WebAPI'

let previousCommentHTML = null

const hasCommentsTurnedOff = function () {
  let commentTurnedOffSelction = Array.from(document.querySelectorAll('#message > span.style-scope.yt-formatted-string[dir="auto"]'))
  if (commentTurnedOffSelction.length > 0) {
    return  "Comments are turned off. " === commentTurnedOffSelction[0].innerText
  } 
  return false
  // used for another time when there are no comments.... and the "Comments are turned off" section is not available
  // else {
  //   let addANewCommentBox = Array.from(document.querySelectorAll("#simplebox-placeholder"))
  //   if (addANewCommentBox.length == 0) {
  //     return true
  //   } else {
  //     return false
  //   }
  // }
}

const getDivAboveYTC= function () {
  return Array.from(document.querySelectorAll('#contents.style-scope.ytd-item-section-renderer')).filter(el => {
    return el.innerHTML.includes('id="youtubeCommenter"')
  })[0]
}

const getCommentSection = function () {
  try {
    // what it was before....
    // return Array.from(document.querySelectorAll('#contents.style-scope.ytd-item-section-renderer')).filter(el => {
    //   return el.innerHTML.includes('id="message"')
    // })[0
    const commentSection = Array.from(document.querySelectorAll('#comments #message'))
    if (commentSection.length > 0) {
      return commentSection[0]
    } else {
      return null
    }
    // this is for coding purposes I dont want to refresht the page
  } catch(ex) {
    return getDivAboveYTC()
  }
}

const getVideoID = function () {
  let urlparam = new URLSearchParams(window.location.search)
  return urlparam.get("v")
}

const getUserImage = function () {
  return document.querySelector('img[alt="Avatar image"]').getAttribute('src')
}

const hasImportantInformation = function () {
  try {
    let videoID = getVideoID()
    if (videoID) {
      return {
        videoID,
      }
    } else {
      return false
    }
  } catch (ex) {
    console.error(ex)
    return false
  }
}

const isDarkMode = function () {
  const hasMetaDarkContent = document.querySelectorAll('meta[content="rgba(33,33,33,0.98)"]').length > 0
  const hasHTMLDark = document.querySelectorAll('html[dark="true"]').length > 0
  return hasMetaDarkContent && hasHTMLDark
}

const setCommentSectionHTML = function (commentSection, isDark) {
  let color = "black"
  if (isDark) {
    color = "white"
  }
  const hasYTCommenter = commentSection.querySelector("#youtubeCommentor") 
  if (!hasYTCommenter) {
    let divBlock = document.createElement('div')
    divBlock.id = "youtubeCommentor"
    divBlock.style = `color: ${color}; font-size: 1.5rem !important`
    commentSection.appendChild(divBlock)
  }
  // hide the disabled section that Youtube shows
  commentSection.querySelector("span").hidden = true
  commentSection.querySelector("a").hidden = true
}


let app = null 
// propably what we want to do is look for a script, to ensure that something was loaded into the dom
// if the presence of something is there then we are good, we know that youtube is working in javascript
// then we know certian things would have fired off in the APIs Network calls on Youtube.
// the thing is Youtube prevents or limits the number of calls to its next API (comments)
// this will cause a problem when a video has comments on it already.  We only want to show our comments when there
// is a page that contains no comments at all.  This means we have to confirm that the page contains "Comments are turned off. Learn more"
const TOTAL_TIME_LOOKING_FOR_NO_COMMENTS = 15 // seconds
const TIME_BETWEEN_ATTEMPTS = 1000 
const MAX_NUMBER_OF_ATTEMPTS = (1000.0 / (TIME_BETWEEN_ATTEMPTS * 1.0)) * TOTAL_TIME_LOOKING_FOR_NO_COMMENTS
let conn = null
let identifiedThatThePageIsNotDisabled = false

const createConnection = function () {
  if (!conn) {
    conn = youtubeContentScript.create({onReceiveLoadingEvent: function () {
      let makeARun = app || identifiedThatThePageIsNotDisabled
      if (app) {
        app.$destroy()
        app = null
      }
      if (makeARun) {
        run()
      }
    }})
    conn.initialize()
    registerConnection(conn)
  }
}

const createYTCommentSection = function (i) {
  const commentSection = getCommentSection()
  if (commentSection) {
    let pageInfo = hasImportantInformation()
    clearInterval(i)
    const isDark = isDarkMode()
    setCommentSectionHTML(commentSection, isDark)
    // fetch the comments on the server or something.
    app = new Youtube({
      target: document.querySelector('#youtubeCommentor'),
      props: {
        video_id: pageInfo.videoID,
        is_dark_mode: isDark
      }
    });
  }
}


const run = function () {
  let numberOfAttemps = 0
  identifiedThatThePageIsNotDisabled = false
  let i = setInterval(() => {
    if (hasCommentsTurnedOff())     {
      let setupInterval = setInterval(() => {
        let pageInfo = hasImportantInformation()
        if (pageInfo) {
          createYTCommentSection(setupInterval)
        }
      }, 1000)
      clearInterval(i)
    } else {
      numberOfAttemps = numberOfAttemps + 1
      if (numberOfAttemps === MAX_NUMBER_OF_ATTEMPTS) {
        identifiedThatThePageIsNotDisabled = true
        clearInterval(i)
      }
    }
  }, TIME_BETWEEN_ATTEMPTS)
}

createConnection()
run()
/**
 * if it is small the view will be on the very bottom of the page
 * if it is large the view will be on near the top of the page
 * if we have the onScrollEvent trigger when to or when not to show the comments
 * then we can use the amount scrolled and the size of the screen to confirm how far we have to go
 * to get the 
 */
export default app;