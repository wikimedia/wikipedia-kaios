import { h } from 'preact'
import { useRef, useLayoutEffect } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey } from 'hooks'
import { ListView } from 'components'

export const ArticleToc = ({ items, currentAnchor, onSelectItem, close, closeAll }) => {
  const containerRef = useRef()
  const listRef = useRef()
  const i18n = useI18n()
  const listItems = parseTocItems(items)
  const [, setNavigation, getCurrent] = useNavigation('ArticleToc', containerRef, listRef, 'y')
  const onKeyCenter = () => {
    const { index } = getCurrent()
    const item = listItems[index]

    if (item && item.title) {
      onSelectItem(item)
      closeAll()
    }
  }
  useSoftkey('ArticleToc', {
    left: i18n('softkey-close'),
    onKeyLeft: () => closeAll(),
    center: i18n('centerkey-select'),
    onKeyCenter,
    onKeyBackspace: () => close()
  })

  useLayoutEffect(() => {
    setNavigation(listItems.findIndex(item => item.anchor === currentAnchor))
  }, [])

  return <div class='toc' ref={containerRef}>
    <ListView header={i18n('header-sections')} items={listItems} containerRef={listRef} />
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
