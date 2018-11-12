import {
  serveToast,
  utf8ArrayToStr,
  copyTextToClipboard
} from './helpers'

class TextMessage extends HyperHTMLElement {
  static get observedAttributes() {
    return ['rawMessage']
  }

  created() {
    this.message = JSON.parse(this.rawMessage)
    this.from = this.message.from.slice(41) // .slice(41) is current hacky id system
    this.content = utf8ArrayToStr(this.message.data.data) // wacky data structure and encoding shit
    this.timestamp = trim(new Date().toTimeString())

    function trim(time) {
      // grep timezone from timestring, including parens,
      // capture group 1 is timezone without parens
      const re = /\(([^)]+)\)/i
      const matchGroups = time.match(re);
      const timezone = matchGroups[1];
      let abbr = timezone
      // if timezone contains word-boundary letters, abbreviate it
      if (timezone.search(/\W/) >= 0) {
        abbr = timezone
          .match(/\b\w/g)
          .join("")
          .toUpperCase()
      }
      return time.replace(re, `(${abbr})`)
    }

    this.render()
  }

  render() {
    const container = 'flex flex-wrap justify-between items-baseline near-black bg-transparent lh-copy animated slideInUp'
    const content = 'ph2 pt1 measure measure-wide-ns bg-animate hover-bg-near-white overflow-x-auto f4'
    const spacingDottedLine = "dn db-ns mt1 ml2 mr1 ba b--purple b--dotted bl-0 bt-0 br-0 flex-grow-1 flex-shrink-1 f7"
    const from = 'pr1 pv1 f7 black-60'
    const timestamp = 'pv1 pl1 f6 black-60'

    return this.html`
      <div class=${container}>
        <div class=${content}
              data-call=copyText
              onClick=${this}>${this.content.message}</div>
        <div class=${spacingDottedLine}></div>
        <div class=${from}>from: ${this.from},</div>
        <div class=${timestamp}>${this.timestamp}</div>
      </div>`
  }

  copyText(e) {
    copyTextToClipboard(e.target.textContent)
    serveToast('copied to clipboard')
    e.target.blur()
  }
}

TextMessage.define('text-message')
