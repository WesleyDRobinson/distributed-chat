import { addFile, broadcastMessage } from "./ipfsFunctions"

export const handleImage = async function handleImage(filePackage) {
  const [entry] = await addFile(filePackage)
  const path = `/${entry.hash}/${filePackage[0].name}`
  const gatewayUrl = new URL(`https://ipfs.io/ipfs${path}`).href

  const imagePayload = {
    type: 'image',
    src: gatewayUrl,
    entry,
    path,
  }

  const broadcastRes = await broadcastMessage(imagePayload)

  return { status: 'ok', message: 'payload broadcast', imagePayload, broadcastRes }
}
