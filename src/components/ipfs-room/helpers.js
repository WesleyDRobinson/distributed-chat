const { wire } = HyperHTMLElement

module.exports = {
  peerJoined: (peer) => {
    this.setState({ peerCount: this.state.peerCount + 1 })
    this.serveToast(`${peer.slice(41)} joined the room`)
  },
  peerLeft: (peer) => {
    this.setState({ peerCount: this.state.peerCount - 1 })
    this.serveToast(`${peer.slice(41)} left the room`)
  },
  message: (message) => {
    console.log('sup?')
    // message.data is a buffer
    let msgDiv = wire(message)`
  <div class="flex flex-wrap justify-between items-baseline near-black bg-transparent lh-copy slideInUp animated">
    <div class="ph2 pt1 measure measure-wide-ns bg-animate hover-bg-near-white overflow-x-auto f4" data-call=copyText onclick=${this}>${message.data.toString()}</div>
    <div class="dn db-ns mt1 ml2 mr1 ba b--purple b--dotted bl-0 bt-0 br-0 flex-grow-1 flex-shrink-1 f7"></div>
    <div class="ph2 pa2-ns f7 black-60">from: ${message.from.slice(41)},</div>
    <div class="pv1 ph2-ns f6 black-60">${new Date().toTimeString()}</div>
  </div>`

    let output = document.getElementById('output')
    output.classList.add('bl', 'bw1', 'b--light-blue')
    output.appendChild(msgDiv)
    output.scrollTop = output.scrollHeight
  }
}