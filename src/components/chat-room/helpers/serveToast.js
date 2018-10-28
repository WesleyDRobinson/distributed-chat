import { getOrMakeToastContainer } from "./getOrMakeToastContainer"

const { wire } = HyperHTMLElement

export const serveToast = async function serveToast(msg) {
  const toast = wire()`<toast-announce entry="fadeInDown" exit="fadeOutRight">${msg}</toast-announce>`
  const toastContainer = await getOrMakeToastContainer()
  toastContainer.appendChild(toast)
}
