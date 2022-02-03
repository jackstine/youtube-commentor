function timeDifference(current, previous) {

  const miliseconds = 1000;
  const msPerMinute = 60 * miliseconds;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = current - previous;
  if (elapsed < miliseconds) {
    return 'now'
  } else if (elapsed < msPerMinute) {
       return Math.round(parseInt(elapsed / 1000)) + ' seconds ago';   
  } else if (elapsed < msPerHour) {
       return Math.round(elapsed/msPerMinute) + ' minutes ago';   
  } else if (elapsed < msPerDay ) {
       return Math.round(elapsed/msPerHour ) + ' hours ago';   
  } else if (elapsed < msPerMonth) {
      return Math.round(elapsed/msPerDay) + ' days ago';   
  } else if (elapsed < msPerYear) {
      return Math.round(elapsed/msPerMonth) + ' months ago';   
  } else {
      return Math.round(elapsed/msPerYear ) + ' years ago';   
  }
}

const makeId = function(length) {
  const result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

export default {
  timeDifference,
  makeId
}
