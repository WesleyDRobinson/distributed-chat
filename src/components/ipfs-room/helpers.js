module.exports = {
  utf8ArrayToStr: (array) => {
    // http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt
    let out, i, len, c;
    let char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
      c = array[i++];
      switch (c >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          // 0xxxxxxx
          out += String.fromCharCode(c);
          break;
        case 12:
        case 13:
          // 110x xxxx   10xx xxxx
          char2 = array[i++];
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
          break;
        case 14:
          // 1110 xxxx  10xx xxxx  10xx xxxx
          char2 = array[i++];
          char3 = array[i++];
          out += String.fromCharCode(((c & 0x0F) << 12) |
            ((char2 & 0x3F) << 6) |
            ((char3 & 0x3F) << 0));
          break;
      }
    }

    return out;
  },
  copyTextToClipboard: (text) => {
    // for today
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text)
      return
    }

    // for the future!
    navigator.clipboard.writeText(text)
      .then(() => console.log('Async: Copying to clipboard was successful!'))
      .catch(err => console.error('Async: Could not copy text: ', err))

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
        console.log('Fallback: Copying text command was ' + msg)
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err)
      }

      document.body.removeChild(textArea)
    }
  }
}
