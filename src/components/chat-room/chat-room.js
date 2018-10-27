import TextMessage from './text-message'
import ToastAnnounce from '../toast-announce'
import RoomHeading from './room-heading'
import { peerJoined, peerLeft, message } from './helpers'

const Room = require('ipfs-pubsub-room')
const toBuffer = require('blob-to-buffer')

const { wire } = HyperHTMLElement

class ChatRoom extends HyperHTMLElement {
  static get observedAttributes() {
    return ['name']
  }

  get defaultState() {
    return { peerCount: 0 }
  }

  created() {
    this.className = 'db h-100 flex flex-column justify-between animated'

    // generate a new Room, i.e., subscribe to a topic
    this.name = this.name || 'default-room-name'
    let room = Room(window.ipfsNode, this.name)
    // attach the room
    this.room = room

    // add functionality to the room
    // announces when a new peer joins the room
    room.on('peer joined', (peer) => {
      this.setState({ peerCount: this.state.peerCount + 1 })
      this.serveToast(`${peer.slice(41)} joined the room`)
    })

    // announces when a peer leaves the room
    room.on('peer left', (peer) => {
      this.setState({ peerCount: this.state.peerCount - 1 })
      this.serveToast(`${peer.slice(41)} left the room`)
    })

    // build the message and add to a messageBackbone
    room.on('message', (message) => {
      let msgDiv = wire(message)`<text-message rawMessage=${JSON.stringify(message)}></text-message>`

      this.messageBackbone = document.getElementById('messageBackbone')
      this.messageBackbone.classList.add('bl', 'bw1', 'b--light-blue')
      this.messageBackbone.appendChild(msgDiv)
      this.messageBackbone.scrollTop = messageBackbone.scrollHeight
    })

    this.render()
  }

  disconnectedCallback() {
    // unsubscribe from ipfs 'topic'
    this.room.leave()
  }

  render() {
    this.html`
            <room-heading peerCount=${this.state.peerCount} />
            
            <article id="messaging" class="flex flex-column justify-end pa3 overflow-y-hidden animated zoomInDown">
                <div id="messageBackbone" class="mw8 mb1 overflow-y-scroll"></div>
                
                <form id="send-message" data-call="sendIt" onsubmit="${this}">
                        <div class="mw9 flex justify-around items-baseline ba b--gold bl-0 bt-0 br-0">
                            <label for="message-entry" id="message-desc" class="clip">broadcast a message to the room</label>
                            <input id="message-entry" class="input-reset f4 pl2 flex-grow-1 ba b--gold bl-0 bt-0 br-0 bg-transparent outline-transparent lh-copy o-80"
                                   type="textarea" aria-describedby="message-desc" autocomplete="off" autofocus style="caret-color:#ffb700">
                            
                            <label id="file-attachment-desc" class="clip">share an image with the room</label>
                            <label for="file-attachment" class="pointer ph3 pv2 mr1 br2 br--top ba b--gold bg-gold f5 lh-copy">📷</label>
                            <input id="file-attachment" type="file" class="clip" accept="image/*" aria-describedby="file-attachment-desc">
                            
                            <label for="message-submit" class="clip">submit the message and file</label>
                            <input id="message-submit" class="pointer ph3 pv2 br2 br--top ba b--gold bg-gold purple f5 fw9 lh-copy"
                                   type="submit" value="➤">
                        </div>
                </form>
            </article>`
  }

  copyText(e) {
    copyTextToClipboard(e.target.textContent)
    this.serveToast('copied to clipboard')
  }

  exit() {
    this.room.leave()
    this.classList.add('zoomOut')
    setTimeout(() => {
      page('/')
    }, 1000)
  }

  // triggered by... data-call="sendIt" onclick="${this}"
  sendIt(e) {
    e.preventDefault()
    let form = e.target // [0] == 'message-entry', [1] == 'file-attachment', [2] == 'message-submit'
    form[2].blur()
    let msg = form[0].value
    let fileList = form[1].files
    let file = fileList[0]

    if (file && file.type.startsWith('image/')) {
      msg += 'tap or click the link to copy'
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
          const url = new URL(`https://ipfs.io/ipfs/${res[0].hash}/${file.name}`).href
          this.room.broadcast(url)
        })
      })
    }

    this.room.broadcast(`${msg}`)
    form.reset()
  }

  showId() {
    window.ipfsNode.id().then(data => {
      this.serveToast(`your peer id is ${data.id.slice(41)}`)
    })
  }

  serveToast(msg) {
    const toast = wire()`<toast-announce entry="fadeInDown" exit="fadeOutRight">${msg}</toast-announce>`

    let toastContainer = document.getElementById('toast-container')
    if (!toastContainer) {
      toastContainer = document.createElement('article')
      toastContainer.id = 'toast-container'
      toastContainer.className = `z-0 mt5 pa2 fixed top-2 right-1`
      this.appendChild(toastContainer)
    }
    toastContainer.appendChild(toast)
  }
}

ChatRoom.define('chat-room')
