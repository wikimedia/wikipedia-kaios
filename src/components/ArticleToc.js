import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey } from 'hooks'
import { ListView } from 'components'

export const ArticleToc = ({ items, close }) => {
  const containerRef = useRef()
  const i18n = useI18n()
  const listItems = parseTocItems(items)
  const [, setNavigation, getCurrent] = useNavigation('ArticleToc', containerRef, 'y')
  const onKeyCenter = () => {
    const { index } = getCurrent()
    const item = listItems[index]

    if (item && item.title) {
      close(item)
    }
  }
  useSoftkey('ArticleToc', {
    right: i18n.i18n('softkey-close'),
    onKeyRight: () => close(),
    center: i18n.i18n('centerkey-select'),
    onKeyCenter
  })

  useEffect(() => {
    setNavigation(0)
  }, [])

  return <div class='toc'>
    <div class='header'>{i18n.i18n('header-sections')}</div>
    <ListView items={listItems} containerRef={containerRef} />
  </div>
}

const parseTocItems = items => {
  return items.map(item => {
    const title = item.line
    const sectionIndex = item.sectionIndex
    const titleHtml = item.level > 1 ? `<span class="subheader${item.level}">${item.line}</span>` : ''
    return { title, sectionIndex, titleHtml }
  })
}
