const getRoom = async function getRoom() {
  const { room } = document.querySelector('chat-room')
  return room ? room : {}
}

/*
*
* filePackage should be an array, [], of objects,
* {
*   path: '/tmp/myfile.txt', // The file path
*   content: <data> // A Buffer, Readable Stream or Pull Stream with the contents of the file
* }
* https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add
*
* */
const addFile = async function addFile(filePackage) {
  return window.ipfsNode.add(filePackage)
}

// activates room.on('message') listeners
const broadcastMessage = async function broadcastMessage(message) {
  const room = await getRoom()
  try {
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
