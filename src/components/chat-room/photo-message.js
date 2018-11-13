class PhotoMessage extends HyperHTMLElement {
  static get observedAttributes() {
    return ['src']
  }

  created() {
    this.render()
  }

  render() {
    const image = 'db w-100'
    const link = 'link black-60 hover-gold'
    this.html`
<img class=${image} src=${this.src} alt="user uploaded content">
<a class=${link} href=${this.src}>${this.src}</a>
`
  }
}

PhotoMessage.define('photo-message')
