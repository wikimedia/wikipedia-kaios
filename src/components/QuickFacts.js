import { h, Fragment } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { useArticle, useNavigation, useScroll, useI18n, useSoftkey } from 'hooks'

export const QuickFacts = ({ lang, title }) => {
  const i18n = useI18n()
  const article = useArticle(lang, title)
  const containerRef = useRef()
  const [, setNavigation] = useNavigation('QuickFacts', containerRef, 'x', 'a[href]:not(.image)')
  const [scrollDown, scrollUp] = useScroll(containerRef, 10, 'y')
  useSoftkey('QuickFacts', {
    right: i18n.i18n('softkey-close'),
    onKeyRight: () => history.back(),
    onKeyArrowDown: scrollDown,
    onKeyArrowUp: scrollUp
  })

  if (!article) {
    return 'Loading...'
  }

  useEffect(() => {
    setNavigation(0)
  }, [article])

  return (
    <Fragment>
      <div
        class='quickfacts'
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: article.infobox }}
      />
    </Fragment>
  )
}
