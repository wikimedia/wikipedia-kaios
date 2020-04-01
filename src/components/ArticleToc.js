import { h } from 'preact'
import { useRef, useLayoutEffect } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey } from 'hooks'
import { ListView } from 'components'

export const ArticleToc = ({ items, currentAnchor, onSelectItem, close }) => {
  const containerRef = useRef()
  const i18n = useI18n()
  const listItems = parseTocItems(items)
  const [, setNavigation, getCurrent] = useNavigation('ArticleToc', containerRef, 'y')
  const onKeyCenter = () => {
    const { index } = getCurrent()
    const item = listItems[index]

    if (item && item.title) {
      onSelectItem(item)
      close()
    }
  }
  useSoftkey('ArticleToc', {
    left: i18n('softkey-close'),
    onKeyLeft: () => close(),
    center: i18n('centerkey-select'),
    onKeyCenter
  })

  useLayoutEffect(() => {
    setNavigation(listItems.findIndex(item => item.anchor === currentAnchor))
  }, [])

  return <div class='toc'>
    <ListView header={i18n('header-sections')} items={listItems} containerRef={containerRef} />
  </div>
}

const parseTocItems = items => {
  return items.map(item => {
    const anchor = item.anchor
    const sectionIndex = item.sectionIndex
    const displayTitle = item.level > 1 ? `<span class="subheader${item.level}">${item.line}</span>` : item.line
    return { anchor, title: anchor, sectionIndex, displayTitle }
  })
}
