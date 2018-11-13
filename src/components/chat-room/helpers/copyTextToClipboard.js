export function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text)
    return
  }

  navigator.clipboard.writeText(text)
    .then(() => console.log('navigator clipboard successful!'))
    .catch(err => console.error('navigator clipboard could not copy text: ', err))

  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea")
    textArea.classList.add('clip')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand('copy')
      const msg = successful ? 'successful' : 'unsuccessful'
      console.log('text copied via fallback:' + msg)
    } catch (err) {
      console.error('unable to copy via fallback', err)
    }

    document.body.removeChild(textArea)
  }
}
