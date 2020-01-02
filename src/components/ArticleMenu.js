import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { route } from 'preact-router'
import { useNavigation, useI18n, useSoftkey } from 'hooks'
import { articleHistory } from 'utils'
import { ListView } from 'components'

export const ArticleMenu = ({ close, onTocSelected, onLanguageSelected }) => {
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

  const onPreviousSelected = () => {
    const { lang, title } = articleHistory.prev()
    route(`/article/${lang}/${title}`, true)
    close()
  }

  useEffect(() => {
    setNavigation(0)
  }, [])

  const items = [
    { title: i18n.i18n('menu-section'), action: onTocSelected },
    { title: i18n.i18n('menu-language'), action: onLanguageSelected }
  ]

  // add Previous Section item
  if (articleHistory.hasPrev()) {
    items.unshift({ title: i18n.i18n('menu-previous'), action: onPreviousSelected })
  }

  return <div class='menu'>
    <ListView
      header={i18n.i18n('header-menu')}
      items={items}
      containerRef={containerRef}
    />
  </div>
}
