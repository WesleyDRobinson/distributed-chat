import TextMessage from './text-message'
import ToastAnnounce from '../toast-announce'
import RoomHeading from './room-heading'

import { serveToast, bootstrapRoom } from './helpers'

const toBuffer = require('blob-to-buffer')

class ChatRoom extends HyperHTMLElement {
  static get observedAttributes() {
    return ['name']
  }

  get defaultState() {
    return { peerCount: 0 }
  }

  created() {
    this.className = 'db h-100 flex flex-column justify-between animated'
    this.room = bootstrapRoom({ element: this, name: this.name })
    this.render()
  }

  disconnectedCallback() {
    // unsubscribe from this chat-room's topic
    this.room.leave()
  }

  render() {
    const formButton = `pointer ph3 pv2 br2 br--top ba b--gold bg-gold f5 lh-copy`
    const goldBorderBottom = 'ba b--gold bl-0 bt-0 br-0'
    const messaging = 'pt3 flex flex-column justify-end overflow-y-hidden animated zoomInDown'
    const backbone = 'mw8 mb1 overflow-y-scroll'
    const form = `mw9 ${goldBorderBottom} flex justify-around items-baseline`
    const textInput = `input-reset pl3 bg-transparent outline-transparent lh-copy o-80 ${goldBorderBottom} f4 flex-grow-1`
    const fileLabel = `${formButton} mr1`
    const submit = `${formButton} purple fw9`

    this.html`<room-heading peerCount=${this.state.peerCount}/>
  <section id="messaging" class=${messaging}>
    <div id="messageBackbone" class=${backbone}></div>

    <form id="send-message" data-call="sendIt" onsubmit="${this}">
      <div class=${form}>
        <label for="message-entry" id="message-desc" class="clip">broadcast a message to the room</label>
        <input id="message-entry" class=${textInput} type="textarea" autocomplete="off"
               aria-describedby="message-desc"
               style="caret-color: #ffb700">

        <label id="file-attachment-desc" class="clip">share an image with the room</label>
        <label for="file-attachment" class=${fileLabel}>📷</label>
        <input id="file-attachment" type="file" class="clip" accept="image/*" aria-describedby="file-attachment-desc">

        <label for="message-submit" class="clip">submit the message and file</label>
        <input id="message-submit" class=${submit}
               type="submit" value="➤">
      </div>
    </form>
  </section>`
  }

  decrementPeers() {
    this.setState({ peerCount: this.state.peerCount - 1 })
  }

  incrementPeers() {
    this.setState({ peerCount: this.state.peerCount + 1 })
  }

  copyText(e) {
    copyTextToClipboard(e.target.textContent)
    serveToast('copied to clipboard')
  }

  // triggered by... data-call="sendIt" onclick="${this}"
  sendIt(e) {
    e.preventDefault()

    const form = e.target // [0] == 'message-entry', [1] == 'file-attachment', [2] == 'message-submit'
    let msg = form[0].value
    const fileList = form[1].files
    const file = fileList[0]
    const sendButton = form[2]

    sendButton.blur()

    if (file && file.type.startsWith('image/')) {
      toBuffer(file, (err, buffer) => {
        if (err) return console.error(err)
        const files = [
          {
            path: `/files/${file.name}`,
            content: buffer
          }
        ]
        window.ipfsNode.files.add(files, (err, res) => {
          if (err) return console.error(err)

          const gatewayUrl = new URL(`https://ipfs.io/ipfs/${res[0].hash}/${file.name}`).href
          this.room.broadcast(gatewayUrl)
        })
      })
    }

    this.room.broadcast(`${msg}`)
    form.reset()
  }
}

ChatRoom.define('chat-room')
