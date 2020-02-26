import { useState, useEffect } from 'preact/hooks'

export const usePotd = () => {
  const [potd, setPotd] = useState()

  const getPotdFilename = () => {
    const date = (new Date()).toISOString().slice(0, 10)
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&prop=images&titles=Template:POTD_protected/${date}`
    return fetch(url)
      .then(response => response.json())
      .then(data => data.query.pages[0].images[0].title)
  }

  const getPotdObject = fileName => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=url&titles=${fileName}`
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        const objectKey = Object.keys(data.query.pages)[0]
        const object = data.query.pages[objectKey]

        setPotd({
          author: '',
          caption: '',
          description: '',
          license: '',
          filePage: '',
          thumbnail: object.imageinfo[0].url
        })
      })
  }

  useEffect(() => {
    getPotdFilename()
      .then(fileName => {
        return getPotdObject(fileName)
      })
  }, [])

  return [potd]
}
