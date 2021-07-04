// import browser from "webextension-polyfill";

// const key = "background";
// browser.storage.local.get(key).then((data) => {
//   document.body.style = `background: url(${data[key]})`;
// });

setTimeout(() => {
  addSvelteToApp()
}, 1000 * 5)
// let changeColor = document.getElementById("changeColor");


// changeColor.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: addSvelteToApp,
//   });
// })

const addSvelteToApp = function () {
  setTimeout(() => {
    const youtube = require('./youtube')
  }, 1000 * 7)
}