import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey } from 'hooks'
import { ListView } from 'components'

export const ArticleToc = ({ items, close }) => {
  const containerRef = useRef()
  const i18n = useI18n()
  const softkey = useSoftkey()
  const listItems = []
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

  items.forEach((item, sectionIndex) => {
    if (typeof item === 'string') {
      listItems.push({ title: item, sectionIndex: sectionIndex + 1 })
    } else if (Array.isArray(item)) {
      item.forEach((i, index) => {
        if (index) {
          listItems.push({ title: i, titleHtml: `<span class="subheader">${i}</span>`, sectionIndex: sectionIndex + 1 })
        } else {
          listItems.push({ title: i, sectionIndex: sectionIndex + 1 })
        }
      })
    }
  })

  return <div class='page toc'>
    <div class='header'>{i18n.i18n('sections')}</div>
    <ListView items={listItems} containerRef={containerRef} />
  </div>
}
