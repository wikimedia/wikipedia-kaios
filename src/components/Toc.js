import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { useNavigation, useI18n, useArticle, useSoftkey } from 'hooks'
import { ListView } from 'components'

export const Toc = ({ lang, title }) => {
  const containerRef = useRef()
  const i18n = useI18n()
  const article = useArticle(lang, title)
  const softkey = useSoftkey()
  const items = []

  if (!article) return

  const [, setNavigation, getCurrent] = useNavigation(containerRef, 'y')

  useEffect(() => {
    setNavigation(0)
    softkey.dispatch({ type: 'setLeftText', value: i18n.i18n('close') })
    softkey.dispatch({ type: 'setOnKeyLeft', event: () => history.back() })
    softkey.dispatch({ type: 'setCenterText', value: i18n.i18n('centerkey-select') })
    softkey.dispatch({ type: 'setOnKeyCenter', event: onKeyCenter })
  }, [])

  const onKeyCenter = () => {
    const { index } = getCurrent()
    const item = items[index]

    if (item && item.title) {
      window.location.hash = `/article/${lang}/${title}/${item.title}`
    }
  }

  article.toc.forEach(item => {
    if (typeof item === 'string') {
      items.push({ title: item })
    } else if (Array.isArray(item)) {
      item.forEach((i, index) => {
        if (index) items.push({ title: i, titleHtml: `<span class="subheader">${i}</span>` })
        else items.push({ title: i })
      })
    }
  })

  return <div class='page toc'>
    {/* @todo thinking of <Header name='settings'/> */}
    <div class='header'>Sections</div>
    <ListView items={items} containerRef={containerRef} />
  </div>
}
