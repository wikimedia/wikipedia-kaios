import { h, Fragment } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { useArticle, useNavigation, useScroll, useI18n, useSoftkey } from 'hooks'

export const QuickFacts = ({ lang, title }) => {
  const i18n = useI18n()
  const article = useArticle(lang, title)
  const containerRef = useRef()
  const [, setNavigation] = useNavigation(containerRef, 'x', 'a[href]:not(.image)')
  useSoftkey('QuickFacts', true, {
    left: i18n.i18n('close'),
    onKeyLeft: () => { history.back() }
  })
  useScroll(containerRef, 10, 'y')

  if (!article) {
    return 'Loading...'
  }

  useEffect(() => {
    setNavigation(0)
  }, [article])

  return (
    <Fragment>
      <div
        class='page quickfacts'
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: article.infobox }}
      />
    </Fragment>
  )
}
