import {
  utf8ArrayToStr,
  copyTextToClipboard
} from './helpers'

class TextMessage extends HyperHTMLElement {
  static get observedAttributes() {
    return ['rawMessage']
  }

  created() {
    this.message = JSON.parse(this.rawMessage)
    this.from = this.message.from.slice(41) // .slice(41) is current hacky id
    this.content = utf8ArrayToStr(this.message.data.data) // wacky structure and encoding shit
    this.timestamp = new Date().toTimeString() // i hope this is close enough to your actual time; i don't want to import a library to do this any better
    this.render()
  }

  render() {
    const container = 'flex flex-wrap justify-between items-baseline near-black bg-transparent lh-copy slideInUp animated'
    const content = 'ph2 pt1 measure measure-wide-ns bg-animate hover-bg-near-white overflow-x-auto f4'
    const spacingDottedLine = "dn db-ns mt1 ml2 mr1 ba b--purple b--dotted bl-0 bt-0 br-0 flex-grow-1 flex-shrink-1 f7"
    const from = 'ph2 pa2-ns f7 black-60'
    const timestamp = 'pv1 ph2-ns f6 black-60'
    return this.html`
      <div class=${container}>
        <div class=${content}
              data-call=copyText
              onClick=${this}>${this.content}
        </div>
        <div class=${spacingDottedLine}></div>
        <div class=${from}>from: ${this.from},</div>
        <div class=${timestamp}>${this.timestamp}</div>
      </div>`
  }

  copyText(e) {
    copyTextToClipboard(e.target.textContent)
    this.serveToast('copied to clipboard')
  }
}

TextMessage.define('text-message')
