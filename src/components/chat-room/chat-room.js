import TextMessage from './text-message'
import ToastAnnounce from '../toast-announce'
import RoomHeading from './room-heading'
import InputForm from './input-form'

import { serveToast, bootstrapRoom } from './helpers'

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
    const messaging = 'pt3 flex flex-column justify-end overflow-y-hidden animated zoomInDown'
    const backbone = 'mw8 mb1 overflow-y-scroll'

    this.html`
      <room-heading peerCount=${this.state.peerCount}/>
      
      <section id="messaging" class=${messaging}>
        <div id="messageBackbone" class=${backbone}></div>
        <input-form></input-form>
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
}

ChatRoom.define('chat-room')
