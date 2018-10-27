const { wire } = HyperHTMLElement
const Room = require('ipfs-pubsub-room')

const bootstrapRoom = function bootstrapRoom({ element, ipfsNode = window.ipfsNode, name = 'default-room-name' }) {
  // generate a new Room, i.e., subscribe to a topic
  const room = Room(ipfsNode, name)

  // ** bootstrap room functionality **
  room.on('peer joined', function peerJoined(peer) {
    element.incrementPeers()
    serveToast(`${peer.slice(41)} joined the room`)
  })

  room.on('peer left', function peerLeft(peer) {
    element.decrementPeers()
    serveToast(`${peer.slice(41)} left the room`)
  })

  room.on('message', function message(message) {
    const messageEl = wire(message)`<text-message rawMessage=${JSON.stringify(message)}></text-message>`
    const backboneEl = document.getElementById('messageBackbone')
    attachMessageToBackbone(messageEl, backboneEl)

    function attachMessageToBackbone(msg, bb) {
      bb.classList.add('bl', 'bw1', 'b--light-blue')
      bb.appendChild(msg)
      bb.scrollTop = bb.scrollHeight
    }
  })
  // ** end room bootstrap **

  return room
}

const copyTextToClipboard = function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text)
    return
  }

  navigator.clipboard.writeText(text)
    .then(() => console.log('navigator clipboard successful!'))
    .catch(err => console.error('navigator clipboard could not copy text: ', err))

  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea")
    textArea.classList.add('clip')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand('copy')
      const msg = successful ? 'successful' : 'unsuccessful'
      console.log('text copied via fallback:' + msg)
    } catch (err) {
      console.error('unable to copy via fallback', err)
    }

    document.body.removeChild(textArea)
  }
}

const getOrMakeToastContainer = async function getOrMakeToastContainer() {
  let toastContainer = document.getElementById('toast-container')
  if (toastContainer) return toastContainer

  toastContainer = document.createElement('div')
  toastContainer.id = 'toast-container'
  toastContainer.className = `fixed top-2 right-1 z-999 mt5 pa2 h-100`
  document.body.appendChild(toastContainer)
  return toastContainer
}

const serveToast = async function serveToast(msg) {
  const toast = wire()`<toast-announce entry="fadeInDown" exit="fadeOutRight">${msg}</toast-announce>`
  const toastContainer = await getOrMakeToastContainer()
  toastContainer.appendChild(toast)
}

const utf8ArrayToStr = function utf8ArrayToStr(array) {
  // http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt
  let out, i, len, c;
  let char2, char3;

  out = "";
  len = array.length;
  i = 0;
  while (i < len) {
    c = array[i++];
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12) |
          ((char2 & 0x3F) << 6) |
          ((char3 & 0x3F) << 0));
        break;
    }
  }

  return out;
}

module.exports = {
  bootstrapRoom,
  copyTextToClipboard,
  getOrMakeToastContainer,
  serveToast,
  utf8ArrayToStr,
}
