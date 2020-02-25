import { h } from 'preact'
import { useRef, useState, useEffect } from 'preact/hooks'
import { useSoftkey } from 'hooks'

const deentitize = text => {
  let ret = text.replace(/&gt;/g, '>')
  ret = ret.replace(/&lt;/g, '<')
  ret = ret.replace(/&quot;/g, '"')
  ret = ret.replace(/&apos;/g, "'")
  ret = ret.replace(/&amp;/g, '&')
  return ret
}

export const TestVideo = () => {
  const videoRef = useRef()
  const [videos, setVideos] = useState()
  const [video, setVideo] = useState()
  const [videoIndex, setVideoIndex] = useState(0)

  const getMotd = () => {
    const url = 'https://commons.wikimedia.org/w/api.php?action=featuredfeed&format=json&feed=motd&formatversion=2%27&origin=*'
    return fetch(url)
      .then(response => response.text())
      .then(str => (new window.DOMParser()).parseFromString(str, 'text/xml'))
      .then(data => Array.from(data.querySelectorAll('item')).map((item, index) => {
        return item
      }))
  }

  useEffect(() => {
    getMotd()
      .then(items => {
        setVideos(items)
        console.log(items)
      })
  }, [])

  useEffect(() => {
    if (videos) {
      const item = videos[videoIndex]
      const content = (new window.DOMParser()).parseFromString(item.querySelector('description').textContent, 'text/html')
      const html = (new window.DOMParser()).parseFromString(content.body.innerHTML, 'text/html')

      // const videoPayload = deentitize()
      if (html.querySelector('a[href$="webm"]')) {
        const videoElement = (new window.DOMParser()).parseFromString(
          (deentitize(html.body.querySelector('div[videopayload]').getAttribute('videopayload'))), 'text/html'
        ).querySelector('video')
        const webm160p = videoElement.querySelector('source[data-transcodekey="160p.webm"]') && videoElement.querySelector('source[data-transcodekey="160p.webm"]').getAttribute('src')
        const webm240p = videoElement.querySelector('source[data-transcodekey="240p.webm"]') && videoElement.querySelector('source[data-transcodekey="240p.webm"]').getAttribute('src')
        const webm360p = videoElement.querySelector('source[data-transcodekey="360p.webm"]') && videoElement.querySelector('source[data-transcodekey="360p.webm"]').getAttribute('src')
        const webm480p = videoElement.querySelector('source[data-transcodekey="480p.webm"]') && videoElement.querySelector('source[data-transcodekey="480p.webm"]').getAttribute('src')

        const video = webm160p || webm240p || webm360p || webm480p
        console.log('play video:', video)
        setVideo(video)
      }
    }
  }, [videoIndex, videos])

  useSoftkey('TestVideo', {
    right: 'Back',
    onKeyRight: () => history.back(),
    onKeyboard4: () => { videoRef.current.currentTime -= 10 },
    onKeyboard5: () => { videoRef.current && videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause() },
    onKeyboard6: () => { videoRef.current.currentTime += 10 },
    onKeyArrowLeft: () => {
      const newIndex = videoIndex - 1
      setVideoIndex(newIndex >= 0 ? videoIndex - 1 : 0)
    },
    onKeyArrowRight: () => {
      const newIndex = videoIndex + 1
      setVideoIndex(newIndex < videos.length ? videoIndex + 1 : videoIndex)
    }
  }, [videos, videoIndex])

  return (
    <div>
      {
        video ? (
          <video key={video} width='250' autoplay='true' loop='true' controls='true' ref={videoRef} style='width:100%'>

            <source src={video}
              type='video/webm' />

    Sorry, your browser doesn't support embedded videos.
          </video>
        ) : 'loading video'
      }
      <p style='margin:0'>
          Press 4 to previous 10 seconds <br />
          Press 5 to pause or play <br />
          Press 6 to next 10 seconds <br />
          Left/Right to change video
      </p>
    </div>
  )
}
