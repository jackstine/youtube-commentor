function makeid(length) {
  var result           = '';
  let letters          = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    if (i === 0 ) {
      result += letters.charAt(Math.floor(Math.random() * charactersLength));
    } else {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  }
  return result
}


module.exports = {
  makeid
}
