import { h } from 'preact'
import { useState, useRef } from 'preact/hooks'
import { useSoftkey, useI18n, useVideoNavigation } from 'hooks'

export const Video = ({ close, items = [] }) => {
  const i18n = useI18n()
  const contentRef = useRef()
  const [isPaused, togglePause] = useState(false)
  const [itemIndex, setItemIndex] = useState(0)

  // todo: change to item list
  const video = ['https://upload.wikimedia.org/wikipedia/commons/2/23/2019-05-12_decouv-etape7-TdF2019-Belfort-576p.webm']

  const linkHandlers = {
    action: ({ action }) => {
      const videoRef = contentRef.current.querySelector('video')
      let newIndex
      switch (action) {
        case 'previous' :
          newIndex = itemIndex - 1
          setItemIndex(newIndex >= 0 ? newIndex : 0)
          break
        case 'backforward' :
          videoRef.currentTime -= 10
          break
        case 'toggle' :
          if (isPaused) {
            videoRef.play()
          } else {
            videoRef.pause()
          }
          togglePause(!isPaused)
          break
        case 'fastforward' :
          videoRef.currentTime += 10
          break
        case 'next' :
          newIndex = itemIndex + 1
          setItemIndex(newIndex < video.length ? newIndex : video.length - 1)
          break
      }
    }
  }
  useVideoNavigation('Video', contentRef, linkHandlers, [isPaused])
  useSoftkey('Video', {
    left: i18n.i18n('softkey-close'),
    onKeyLeft: () => {
      const videoRef = contentRef.current.querySelector('video')
      videoRef.pause()
      close()
    }
  })

  return (
    <div class='video' ref={contentRef}>
      <p class='header'>Video of the day</p>
      <div class='source'>
        <video key={video[itemIndex]} autoplay='true' loop='true' controls='true' style='width:100%'>
          <source src={video[itemIndex]} type='video/webm' />
        Sorry, your browser doesn't support embedded videos.
        </video>
      </div>
      <div class='panel'>
        <div class='button' data-action='previous' key='previous'>
          <img src='/images/video-previous.png' />
        </div>
        <div class='button forward' data-action='backforward' key='backforward'>
          <img src='/images/video-backforward.png' />
        </div>
        <div class='button' data-action='toggle' key='toggle'>
          <img src={`/images/video-${isPaused ? 'play' : 'pause'}.png`} />
        </div>
        <div class='button forward' data-action='fastforward' key='fastforward'>
          <img src='/images/video-fastforward.png' />
        </div>
        <div class='button rotate' data-action='next' key='next'>
          <img src='/images/video-previous.png' />
        </div>
      </div>
    </div>
  )
}
