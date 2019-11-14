import { h, Fragment } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { Softkey } from 'components'
import { useArticle, useNavigation, useScroll, useI18n } from 'hooks'

export const QuickFacts = ({ lang, title }) => {
  const i18n = useI18n()
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
    history.back()
  }

  return (
    <Fragment>
      <div
        class='page quickfacts'
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: article.infobox }}
      />
      <Softkey
        left={i18n.i18n('close')}
        onKeyLeft={backToArticle}
      />
    </Fragment>
  )
}
