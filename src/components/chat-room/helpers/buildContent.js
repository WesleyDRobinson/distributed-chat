const { wire } = HyperHTMLElement

export const buildContent = {
  image: async function buildImage({ src, message, ...rest }) {
    return JSON.stringify({
      element: wire()`<img src=${src} alt=${message}>`,
      ...rest
    })
  },
  text: async function buildText(message) {
    return JSON.stringify({
      element: wire(message)`<text-message rawMessage=${message}></text-message>`,
      ...message
    })
  },
}
