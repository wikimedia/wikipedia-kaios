import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey } from 'hooks'
import { ListView } from 'components'

export const ArticleToc = ({ items: toc, close }) => {
  const containerRef = useRef()
  const i18n = useI18n()
  const softkey = useSoftkey()
  const items = []
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
    const item = items[index]

    if (item && item.title) {
      close(item)
    }
  }

  toc.forEach((item, sectionIndex) => {
    if (typeof item === 'string') {
      items.push({ title: item, sectionIndex: sectionIndex + 1 })
    } else if (Array.isArray(item)) {
      item.forEach((i, index) => {
        if (index) {
          items.push({ title: i, titleHtml: `<span class="subheader">${i}</span>`, sectionIndex: sectionIndex + 1 })
        } else {
          items.push({ title: i, sectionIndex: sectionIndex + 1 })
        }
      })
    }
  })

  return <div class='page toc'>
    <div class='header'>{i18n.i18n('sections')}</div>
    <ListView items={items} containerRef={containerRef} />
  </div>
}
