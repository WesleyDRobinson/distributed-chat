const toBuffer = require('blob-to-buffer')


/*
* @param form  -- a specific HTML Form Element...
* having a filelist as the first input
* and accepting only a single image
* (todo -- find or make more flexible form & file preparer)
*
* returns an array containing an object...
* shaped for uploading to an ipfs node with js-ipfs
*
* */
export async function prepareFilesForUpload(form) {
  const fileList = form[1].files
  const item = fileList[0]

  return await packageFile(item)

  function packageFile(file) {
    return new Promise((resolve, reject) => {
      toBuffer(file, toBufferCallback)

      function toBufferCallback(err, buffer) {
        if (err) {
          console.error(err)
          reject(err)
        }
        resolve([{
          name: file.name,
          path: `/files/${file.name}`,
          content: buffer,
        }])
      }
    })
  }
}
