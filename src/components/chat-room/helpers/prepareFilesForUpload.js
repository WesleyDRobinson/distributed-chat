const toBuffer = require('blob-to-buffer')

export async function prepareFilesForUpload(form) {
  const fileList = form[1].files
  const item = fileList[0]

  return await packageFile(item)

  function packageFile(file) {
    return new Promise((resolve, reject) => {
      const toBufferCallback = function toBufferCallback(err, buffer) {
        if (err) {
          console.error(err)
          reject(err)
        }
        resolve([{
          name: file.name,
          path: `/files/${file.name}`,
          buffer,
        }])
      }
      toBuffer(file, toBufferCallback)
    })
  }
}
