import { h } from 'preact'
import { useRef, useLayoutEffect } from 'preact/hooks'
import { useSoftkey } from 'hooks'

export const TestVideo = () => {
  const videoRef = useRef()

  useLayoutEffect(() => {
    window.v = videoRef
  }, [])

  useSoftkey('TestVideo', {
    right: 'Back',
    onKeyRight: () => history.back(),
    onKeyboard4: () => { videoRef.current.currentTime -= 10 },
    onKeyboard5: () => { videoRef.current && videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause() },
    onKeyboard6: () => { videoRef.current.currentTime += 10 }
  }, [])

  return (
    <div>
      <video width='250' autoplay='true' loop='true' controls='true' ref={videoRef} style='width:100%'>

        <source src='https://upload.wikimedia.org/wikipedia/commons/b/b8/He_Who_Gets_Slapped_%281924%29.webm'
          type='video/webm' />

        <source src='https://interactive-examples.mdn.mozilla.net/media/examples/flower.mp4'
          type='video/mp4' />

    Sorry, your browser doesn't support embedded videos.
      </video>

      <p style='margin:0'>
          Press 4 to previous 10 seconds <br />
          Press 5 to pause or play <br />
          Press 6 to next 10 seconds
      </p>
    </div>
  )
}
