import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey, usePopup } from 'hooks'
import { articleHistory, goto } from 'utils'
import { ListView, TextSize } from 'components'

export const ArticleMenu = ({
  close, onTocSelected, onLanguageSelected,
  onQuickFactsSelected, onGallerySelected,
  onShareArticleUrl,
  hasLanguages, hasInfobox, hasGallery,
  isShareEnabled
}) => {
  const containerRef = useRef()
  const listRef = useRef()
  const i18n = useI18n()
  const onKeyCenter = () => {
    const { index } = getCurrent()
    const enabledItems = items.filter(item => item.enabled)
    const item = enabledItems[index]

    if (item.action) {
      item.action()
    }
  }

  useSoftkey('Menu', {
    left: i18n('softkey-close'),
    onKeyLeft: close,
    center: i18n('centerkey-select'),
    onKeyCenter,
    onKeyBackspace: close
  })

  const [, setNavigation, getCurrent] = useNavigation('Menu', containerRef, listRef, 'y')

  const onSearchSelected = () => {
    close()
    goto.search()
  }

  const onTextsizeSelected = () => {
    const [showTextSize] = usePopup(TextSize, { stack: true, hideOthers: true })
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
    {
      title: i18n('search-placeholder'),
      action: onSearchSelected,
      enabled: true
    },
    {
      title: i18n('menu-previous'),
      description: articleHistory.hasPrev() ? articleHistory.getPrev().title : null,
      action: onPreviousSelected,
      enabled: articleHistory.hasPrev()
    },
    {
      title: i18n('article-action-sections'),
      action: onTocSelected,
      enabled: true
    },
    {
      title: i18n('menu-textsize'),
      action: onTextsizeSelected,
      enabled: true
    },
    {
      title: i18n('article-action-quickfacts'),
      action: onQuickFactsSelected,
      enabled: hasInfobox
    },
    {
      title: i18n('article-action-gallery'),
      action: onGallerySelected,
      enabled: hasGallery
    },
    {
      title: i18n('article-action-languages'),
      action: onLanguageSelected,
      enabled: hasLanguages
    },
    {
      title: i18n('article-action-share'),
      action: onShareArticleUrl,
      enabled: isShareEnabled
    }
  ]

  return <div class='menu' ref={containerRef}>
    <ListView
      header={i18n('header-menu')}
      items={items.filter(item => item.enabled)}
      containerRef={listRef}
    />
  </div>
}
