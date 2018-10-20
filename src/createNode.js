const createIpfsNode = function createIpfsNode() {
  const repoId = () => `node/distributed-chat/${Math.random()}`
// Ipfs global exposed in HTML <head>
  return new Ipfs({
    repo: repoId(),
    EXPERIMENTAL: {
      pubsub: true
    },
    config: {
      Addresses: {
        Swarm: [
          // todo -- build own handshake servers
          '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
          '/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star'
        ]
      }
    }
  })
}

module.exports = createIpfsNode
