const getRoom = async () => {
  const { room } = document.querySelector('ipfs-room')
  return room ? room : {}
}
const getRoomName = async () => {
  const room = await getRoom()
  return room._topic
}
const getIpfsNode = async () => {
  const room = await getRoom()
  const ipfsNode = room._ipfs.id()
  return ipfsNode
}
const getPeers = async () => {
  let room = await getRoom()
  return room._peers
}
const getPeerCount = async () => {
  const peers = await getPeers()
  return peers.length
}
const leaveRoom = async () => {
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
