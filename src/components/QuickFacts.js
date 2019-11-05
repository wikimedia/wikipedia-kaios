import { h, Fragment } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { Softkey } from 'components'
import { useArticle, useNavigation, useScroll } from 'hooks'

export const QuickFacts = ({ lang, title }) => {
  const article = useArticle(lang, title)
  const containerRef = useRef()
  const [, setNavigation] = useNavigation(containerRef, 'x', 'a[href]:not(.image)')
  useScroll(containerRef, 10, 'y')

  if (!article) {
    return 'Loading...'
  }

  useEffect(() => {
    setNavigation(0)
  }, [article])

  const backToArticle = () => {
    window.location.hash = `/article/${lang}/${title}`
  }

  return (
    <Fragment>
      <div
        class='page quickfacts'
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: article.infobox }}
      />
      <Softkey
        left='Back'
        onKeyLeft={backToArticle}
      />
    </Fragment>
  )
}
