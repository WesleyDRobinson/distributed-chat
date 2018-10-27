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
    const container = 'flex justify-around items-center w-100 pa2 gradientGO avenir'
    const titleAndExit = 'flex justify-center items-center ph3'
    const roomName = 'mv0 mr2 pa2 br1 lh-title f4 f3-ns fw2 near-white bg-black-60'
    const headerButton = 'grow pointer ph3 pv2 br-pill ba bg-transparent tc ttu tracked f7 fw6 bg-animate hover-bg-orange hover-near-white outline-transparent'
    const showPeers = `${headerButton} b--purple purple`
    const exit = `${headerButton} b--light-yellow bg-light-yellow gray`
    const myId = `${headerButton} b--blue blue`

    return this.html`
        <header class=${container}>
          <button class=${showPeers}
               data-call="showPeers" onClick="${this}" >${getPeerCount()} peers
          </button>
          <section class=${titleAndExit}>
            <h1 class=${roomName}>${getRoomName()}</h1>
            <button class=${exit}
                 data-call=exit onClick=${this}>exit
            </button>
          </section>
          <button class=${myId}
               data-call="showId" onClick="${this}">my id
          </button>
        </header>`
  }

  async showId(e) {
    const { id } = await getIpfsNode()
    serveToast(`your peer id is ${id.slice(41)}`)
    e.target.blur()
  }

  async showPeers(e) {
    const peers = await getPeers()
    let msg = peers.length === 0
      ? `you are alone in this room`
      : `peers in the room: ${peers.map(peer => peer.slice(41)).join(', ')}`
    serveToast(msg)
    e.target.blur()
  }

  async exit() {
    await leaveRoom()
    page('/')
  }
}

RoomHeading.define('room-heading')
