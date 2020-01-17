import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey, usePopup } from 'hooks'
import { articleHistory, goto } from 'utils'
import { ListView, TextSize } from 'components'

export const ArticleMenu = ({ close, onTocSelected, onLanguageSelected, hasLanguages }) => {
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

  const onPreviousSelected = () => {
    const { lang, title } = articleHistory.prev()
    goto.article(lang, title, true)
    close()
  }

  useEffect(() => {
    setNavigation(0)
  }, [])

  const items = [
    { title: i18n.i18n('article-action-sections'), action: onTocSelected },
    { title: i18n.i18n('menu-textsize'), action: onTextsizeSelected }
  ]

  // add Previous Section item
  if (articleHistory.hasPrev()) {
    items.unshift({
      title: i18n.i18n('menu-previous'),
      description: articleHistory.getPrev().title,
      action: onPreviousSelected
    })
  }

  // add Language Section item
  if (hasLanguages) {
    items.push({
      title: i18n.i18n('menu-language'),
      action: onLanguageSelected
    })
  }

  return <div class='menu'>
    <ListView
      header={i18n.i18n('header-menu')}
      items={items}
      containerRef={containerRef}
    />
  </div>
}
