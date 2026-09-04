export function readImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Please choose a photo.'))
      return
    }
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please attach an image file such as JPG or PNG.'))
      return
    }
    if (file.size > 6 * 1024 * 1024) {
      reject(new Error('Please choose a photo smaller than 6 MB.'))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('The photo could not be read. Please try another file.'))
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error('The photo could not be opened. Please try another file.'))
      image.onload = () => {
        const maxWidth = 900
        const scale = Math.min(1, maxWidth / image.width)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(image.width * scale)
        canvas.height = Math.round(image.height * scale)
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.72))
      }
      image.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
