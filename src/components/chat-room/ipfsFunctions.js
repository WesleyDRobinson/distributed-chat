const { buildContent } = require('./helpers')

const getRoom = async function getRoom() {
  const { room } = document.querySelector('chat-room')
  return room ? room : {}
}
const addFile = async function addFile(filePackage) {
  return window.ipfsNode.files.add(filePackage)
}
const broadcastMessage = async function broadcastMessage({ type, ...rest }) {
  debugger
  const content = await buildContent[type](rest)
  debugger
  const room = await getRoom()
  debugger
  return room.broadcast(content)
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
