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
    const stringified = JSON.stringify(rawMessage)
    const messageEl = wire(message)`<text-message rawMessage=${stringified}></text-message>`
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
