import Popup from './components/Popup.svelte'

setTimeout(() => {
const popupTarget = document.querySelector('#popupApp')
const app = new Popup({
  target: popupTarget,
  props: {}
})
}, 10)
