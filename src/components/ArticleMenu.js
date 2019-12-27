import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey, usePopup } from 'hooks'
import { ListView, TextSize } from 'components'

export const ArticleMenu = ({ close, onTocSelected }) => {
  const containerRef = useRef()
  const i18n = useI18n()
  const onKeyCenter = () => {
    const { index } = getCurrent()
    const item = items[index]

    if (item.action) {
      item.action()
    }
  }
  useSoftkey('Menu', {
    right: i18n.i18n('softkey-close'),
    onKeyRight: close,
    center: i18n.i18n('centerkey-select'),
    onKeyCenter
  })

  const [, setNavigation, getCurrent] = useNavigation('Menu', containerRef, 'y')

  const onTextsizeSelected = () => {
    const [showTextSize] = usePopup(TextSize, { position: 'auto' })
    showTextSize()
  }

  useEffect(() => {
    setNavigation(0)
  }, [])

  const items = [
    { title: i18n.i18n('menu-section'), action: onTocSelected },
    { title: i18n.i18n('menu-textsize'), action: onTextsizeSelected }
  ]

  return <div class='menu'>
    <ListView
      header={i18n.i18n('header-menu')}
      items={items}
      containerRef={containerRef}
    />
  </div>
}
