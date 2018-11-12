const { buildContent } = require('./buildContent')

const getRoom = async function getRoom() {
  const { room } = document.querySelector('chat-room')
  return room ? room : {}
}
const addFile = async function addFile(filePackage) {
  return window.ipfsNode.files.add(filePackage)
}
const broadcastMessage = async function broadcastMessage(message) {
  const room = await getRoom()
  try {
    // const { type } = message
    // // build a text-message or image-preview custom element
    // const content = await buildContent[type](message)
    // const strContent = JSON.stringify(content)

    // .broadcast() emits the 'message' event, listened for in bootstrapRoom.js
    switch (typeof message) {
      case 'object':
        return room.broadcast(JSON.stringify(message))
      case 'string':
      default:
        return room.broadcast(message)
    }
  } catch (e) {
    console.error(e)
  }
}
const getRoomName = async function getRoomName() {
  const room = await getRoom()
  return room._topic
}
const getIpfsNode = async function getIpfsNode() {
  const room = await getRoom()
  return room._ipfs.id()
}
const getPeers = async function getPeers() {
  const room = await getRoom()
  return room._peers ? room._peers : {}
}
const getPeerCount = async function getPeerCount() {
  const peers = await getPeers()
  return peers.length
}
const leaveRoom = async function leaveRoom() {
  const room = await getRoom()
  return room.leave()
}

module.exports = {
  addFile,
  broadcastMessage,
  getRoom,
  getRoomName,
  getIpfsNode,
  getPeerCount,
  getPeers,
  leaveRoom
}
