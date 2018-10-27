import { getPeerCount, getPeers, getRoomName, leaveRoom, getIpfsNode } from './ipfsFunctions'
import { serveToast } from './helpers'

class RoomHeading extends HyperHTMLElement {
  static get observedAttributes() {
    return ['peerCount', 'peers']
  }

  created() {
    this.className = 'animated zoomInUp'
    this.render()
  }

  render() {
    const container = 'flex justify-around items-center w-100 cf pa2 gradientGO avenir'
    const peers = 'pointer grow ph2 pv2 br-pill ba b--purple bg-purple near-white tracked tc ttu f7'
    const titleExit = 'flex justify-center items-center ph3'
    const roomName = 'mv0 mr2 pa2 br1 lh-title f4 f3-ns fw2 near-white bg-black-60'
    const exit = 'pointer pv2 ph3 br-pill ba b--light-yellow bg-light-yellow gray tracked tc ttu f7'
    const myId = 'pointer grow  ph2 pv2 br-pill ba b--blue bg-blue near-white tracked tc ttu f7'
    return this.html`
        <div class=${container}>
          <div class=${peers}
               data-call="showPeers" onClick="${this}" >${getPeerCount()} peers
          </div>
          <div class=${titleExit}>
            <h1 class=${roomName}>${getRoomName()}</h1>
            <div class=${exit}
                 data-call=exit onClick=${this}>exit
            </div>
          </div>
          <div class=${myId}
               data-call="showId" onClick="${this}">my id
          </div>
        </div>`
  }

  async showId() {
    const { id } = await getIpfsNode()
    serveToast(`your peer id is ${id.slice(41)}`)
  }

  async showPeers() {
    const peers = await getPeers()
    let msg = peers.length === 0
      ? `you are alone in this room`
      : `peers in the room: ${peers.map(peer => peer.slice(41)).join(', ')}`
    serveToast(msg)
  }

  exit() {
    leaveRoom()
    page('/')
  }

}

RoomHeading.define('room-heading')
