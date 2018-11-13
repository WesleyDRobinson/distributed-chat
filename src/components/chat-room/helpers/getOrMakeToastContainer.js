export async function getOrMakeToastContainer() {
  let toastContainer = document.getElementById('toast-container')
  if (toastContainer) return toastContainer

  toastContainer = document.createElement('div')
  toastContainer.id = 'toast-container'
  toastContainer.className = `fixed top-2 right-1 z-999 mt5 pa2 h-100`
  document.body.appendChild(toastContainer)
  return toastContainer
}