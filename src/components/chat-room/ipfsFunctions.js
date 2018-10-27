const getRoom = async function getRoom() {
  const { room } = document.querySelector('chat-room')
  return room ? room : {}
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
  getRoom,
  getRoomName,
  getIpfsNode,
  getPeerCount,
  getPeers,
  leaveRoom
}
