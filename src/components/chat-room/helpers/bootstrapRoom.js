import { serveToast } from './serveToast'
import { utf8ArrayToStr } from './utf8ArrayToStr'
import '../photo-message'

const Room = require('ipfs-pubsub-room')

const { wire } = HyperHTMLElement

export const bootstrapRoom = function bootstrapRoom({ element, ipfsNode = window.ipfsNode, name = 'default-room-name' }) {
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

  room.on('message', function message(rawMessage) {
    const strRawMessage = JSON.stringify(rawMessage)
    const backboneEl = document.getElementById('messageBackbone')
    const content = JSON.parse(utf8ArrayToStr(rawMessage.data)) // wacky data structure and encoding shit

    if (content.type === 'text') {
      const messageEl = wire()`<text-message rawMessage=${strRawMessage}></text-message>`
      attachMessageToBackbone(messageEl, backboneEl)
    } else if (content.type === 'image') {
      const src = `/ipfs${content.path}`
      const photoEl = wire()`<photo-message src=${content.src}></photo-message>`
      attachMessageToBackbone(photoEl, backboneEl)
    }

    function attachMessageToBackbone(msg, bb) {
      bb.classList.add('bl', 'bw1', 'b--light-blue')
      bb.appendChild(msg)
      bb.scrollTop = bb.scrollHeight
    }
  })

  return room
}
