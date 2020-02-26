import { useState, useEffect } from 'preact/hooks'

const deentitize = text => {
  let ret = text.replace(/&gt;/g, '>')
  ret = ret.replace(/&lt;/g, '<')
  ret = ret.replace(/&quot;/g, '"')
  ret = ret.replace(/&apos;/g, "'")
  ret = ret.replace(/&amp;/g, '&')
  return ret
}

export const useMotd = () => {
  const [videos, setVideos] = useState([])

  const getMotd = () => {
    const url = 'https://commons.wikimedia.org/w/api.php?action=featuredfeed&format=json&feed=motd&formatversion=2%27&origin=*'
    return fetch(url)
      .then(response => response.text())
      .then(str => (new window.DOMParser()).parseFromString(str, 'text/xml'))
      .then(data => Array.from(data.querySelectorAll('item')).reverse())
  }

  useEffect(() => {
    getMotd()
      .then(items => {
        const motdList = items.map(item => {
          const content = (new window.DOMParser()).parseFromString(item.querySelector('description').textContent, 'text/html')
          const html = (new window.DOMParser()).parseFromString(content.body.innerHTML, 'text/html')
          if (html.querySelector('a[href$="webm"]')) {
            const videoElement = (new window.DOMParser()).parseFromString(
              (deentitize(html.body.querySelector('div[videopayload]').getAttribute('videopayload'))), 'text/html'
            ).querySelector('video')

            const webm160p = videoElement.querySelector('source[data-transcodekey="160p.webm"]') && videoElement.querySelector('source[data-transcodekey="160p.webm"]').getAttribute('src')
            const webm240p = videoElement.querySelector('source[data-transcodekey="240p.webm"]') && videoElement.querySelector('source[data-transcodekey="240p.webm"]').getAttribute('src')
            const webm360p = videoElement.querySelector('source[data-transcodekey="360p.webm"]') && videoElement.querySelector('source[data-transcodekey="360p.webm"]').getAttribute('src')
            const webm480p = videoElement.querySelector('source[data-transcodekey="480p.webm"]') && videoElement.querySelector('source[data-transcodekey="480p.webm"]').getAttribute('src')

            return {
              title: item.querySelector('title').textContent,
              poster: videoElement.getAttribute('poster'),
              source: webm160p || webm240p || webm360p || webm480p
            }
          }
        })

        setVideos(motdList.filter(listItem => listItem && listItem.source))
      })
  }, [])

  return [videos]
}
