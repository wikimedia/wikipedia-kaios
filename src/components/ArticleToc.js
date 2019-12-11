import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey } from 'hooks'
import { ListView } from 'components'

export const ArticleToc = ({ items, close }) => {
  const containerRef = useRef()
  const i18n = useI18n()
  const softkey = useSoftkey()
  const listItems = parseTocItems(items)
  const [, setNavigation, getCurrent] = useNavigation(containerRef, 'y')

  useEffect(() => {
    setNavigation(0)
    softkey.dispatch({ type: 'setLeftText', value: i18n.i18n('close') })
    softkey.dispatch({ type: 'setOnKeyLeft', event: () => close() })
    softkey.dispatch({ type: 'setCenterText', value: i18n.i18n('centerkey-select') })
    softkey.dispatch({ type: 'setOnKeyCenter', event: onKeyCenter })
    softkey.dispatch({ type: 'setRightText', value: '' })
  }, [])

  const onKeyCenter = () => {
    const { index } = getCurrent()
    const item = listItems[index]

    if (item && item.title) {
      close(item)
    }
  }

  return <div class='page toc'>
    <div class='header'>{i18n.i18n('sections')}</div>
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
