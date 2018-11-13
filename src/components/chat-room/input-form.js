import { addFile, broadcastMessage } from './helpers/ipfsFunctions'
import { prepareFilesForUpload } from './helpers'

class InputForm extends HyperHTMLElement {
  render() {
    const formButton = `pointer ph3 pv2 br2 br--top ba b--gold bg-gold f5 lh-copy`
    const goldBorderBottom = 'ba b--gold bl-0 bt-0 br-0'

    const form = `mw9 ${goldBorderBottom} flex justify-around items-baseline`
    const textInput = `input-reset pl3 bg-transparent outline-transparent lh-copy o-80 ${goldBorderBottom} f4 flex-grow-1`
    const fileLabel = `${formButton} mr1`
    const submit = `${formButton} purple fw9`

    return this.html`
      <form id="send-message" data-call="sendIt" onSubmit="${this}">
        <div class=${form}>
          <label for="message-entry" id="message-desc" class="clip">broadcast a message to the room</label>
          <input id="message-entry" class=${textInput} type="textarea" autoComplete="off"
                 aria-describedby="message-desc" style="caret-color: #ffb700">
      
          <label id="file-attachment-desc" class="clip">share an image with the room</label>
          <label for="file-attachment" class=${fileLabel}>📷</label>
          <input id="file-attachment" type="file" class="clip" accept="image/*" aria-describedby="file-attachment-desc">
      
          <label for="message-submit" class="clip">submit the message and file</label>
          <input id="message-submit" class=${submit}
                 type="submit" value="➤">
        </div>
      </form>`
  }

  // triggered by... data-call="sendIt" onclick="${this}"
  async sendIt(e) {
    e.preventDefault()

    const form = e.target // [0] == 'message-entry', [1] == 'file-attachment', [2] == 'message-submit'
    let msg = form[0].value
    const fileList = form[1].files
    const file = fileList[0]
    const sendButton = form[2]

    sendButton.blur()

    if (file && file.type.startsWith('image/')) {
      // try to upload the file to IPFS and broadcast a preview
      try {
        const filesArray = await prepareFilesForUpload(form)
        filesArray.forEach(async function handleImage(filePackage) {
          const [entry] = await addFile(filePackage)
          const path = `/${entry.hash}/${filePackage.name}`
          const gatewayUrl = new URL(`https://ipfs.io/ipfs${path}`).href
          const payload = {
            type: 'image',
            src: gatewayUrl,
            message: `${msg}`,
            path,
          }
          await broadcastMessage(payload)
        })
      } catch (e) {
        console.error('could not broadcast image', e)
      }
    }

    if (msg) {
      try {
        const payload = { type: 'text', message: `${msg}` }
        await broadcastMessage(payload)
      } catch (e) {
        console.error('could not broadcast text', e)
      }
    }

    form.reset()
  }
}

InputForm.define('input-form')
