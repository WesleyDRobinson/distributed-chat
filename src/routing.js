import createIpfsNode from './createNode'
import LoadingConnector from './components/loading-connector'
import StartRoom from './components/welcome/start-room'
import IpfsRoom from './components/chat-room/chat-room'

const { bind } = HyperHTMLElement
const oneSecondTimeout = cb => window.setTimeout(() => cb(), 1000)
const appShell = document.getElementById('app-shell')

page('*', ipfsNodeCheck)
page('/', main)
page('/room', joinRoom)
page('/room/:name', joinRoom)
page('/user', '/')
page('*', '/')
page()

function main(ctx, next) {
  // fadeout main contents
  if (appShell.firstElementChild) appShell.firstElementChild.classList.add('fadeOut')
  // bind start-room element to app-shell
  oneSecondTimeout(() => bind(appShell)`<start-room></start-room>`)
}

function joinRoom(ctx) {
  ctx.state.room = ctx.params.name || 'cat videos'
  appShell.firstElementChild.classList.add('fadeOut')
  oneSecondTimeout(() => bind(appShell)`<chat-room name="${ctx.state.room}"></chat-room>`)
}

function ipfsNodeCheck(ctx, next) {
  if (window.ipfsNode) {
    next()
  } else {
    // show loader
    bind(appShell)`<loading-connector></loading-connector>`

    // create Ipfs repo and node
    const node = createIpfsNode()

    node.once('ready', () => node.id((err, data) => {
      if (err) throw err

      // make node accessible to window
      window.ipfsNode = node

      // "logging"
      console.log(`IPFS node ready with address ${data.id}`)

      next()
    }))
  }
}
