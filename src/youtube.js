import Youtube from './Youtube.svelte';


  const hasCommentsTurnedOff = function () {
    let commentTurnedOffSelction = Array.from(document.querySelectorAll('#message > span.style-scope.yt-formatted-string[dir="auto"]'))
    if (commentTurnedOffSelction.length > 0) {
      return  "Comments are turned off. " === commentTurnedOffSelction[0].innerText
    } else {
      return false
    }
  }

  const getDivAboveYTC= function () {
    return Array.from(document.querySelectorAll('#contents.style-scope.ytd-item-section-renderer')).filter(el => {
      return el.innerHTML.includes('id="youtubeCommentor"')
    })[0]
  }

  const getCommentSection = function () {
    try {
      return Array.from(document.querySelectorAll('#contents.style-scope.ytd-item-section-renderer')).filter(el => {
        return el.innerHTML.includes('id="message"')
      })[0]
      // this is for coding purposes I dont want to refresht the page
    } catch(ex) {
      return getDivAboveYTC()
    }
  }
 let app = null 
console.log('CALLED hasComments Turned off')
let i = setInterval(() => {
  console.log(hasCommentsTurnedOff())
  if (hasCommentsTurnedOff())     {
    console.log('NO COMMENTS')
    getCommentSection().innerHTML = '<div id="youtubeCommentor" style="color: white; font-size: 1.5rem !important"></div>'
    // fetch the comments on the server or something.
    app = new Youtube({
      // target: document.body,
      target: document.querySelector('#youtubeCommentor'),
      props: {}
    });
    console.log('TRIGGGERED')
    console.log(app)
    clearInterval(i)
  }
}, 1000)




export default app;