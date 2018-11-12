import { addFile, broadcastMessage } from "./ipfsFunctions";

export const handleImage = async function handleImage(filePackage) {
  const [entry] = await addFile(filePackage)
  const gatewayUrl = new URL(`https://ipfs.io/ipfs/${entry.hash}/${filePackage.name}`).href
  const payload = {
    type: 'image',
    src: gatewayUrl,
    localSrc: entry,
    message: `${msg}`,
  }
  await broadcastMessage(payload)
}
