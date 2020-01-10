import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { useI18n } from 'hooks'
import { getArticleFooter } from 'api'
import { buildWpMobileWebUrl } from 'utils'

export const ArticleFooter = ({ lang, title }) => {
  const i18n = useI18n()
  // The reason why adding placeholder items is
  // the use article links navigation able to select the first item
  const PLACEHOLDER_ITEMS = Array(3).fill({ title: i18n.i18n('suggested-placeholder') })
  const [footer, setFooter] = useState(PLACEHOLDER_ITEMS)

  useEffect(() => {
    getArticleFooter(lang, title)
      .then(items => setFooter(items))
  }, [])

  return (
    <div class='article-footer'>
      <div class='content'>
        <h2>{i18n.i18n('suggested-articles')}</h2>
        <div class='list'>
          { footer.map(item => {
            return <a class='item' title={item.title}>
              <div class='info'>
                <div class='article-title'>{item.title}</div>
                <div class='description'>{item.description}</div>
              </div>
              { item.thumbnail && <div class='img'><img src={item.thumbnail.source} /></div> }
            </a>
          })}
        </div>
        <h2>
          <img src='/images/wikipedia-wordmark-en.png' height='18' width='116' />
        </h2>
        <p class='license' dangerouslySetInnerHTML={{ __html: i18n.i18n('content-license') }} />
        <p class='browser'>
          <a class='external' rel='mw:ExtLink' href={buildWpMobileWebUrl(lang, title)}>
            {i18n.i18n('view-in-browser')}
          </a>
        </p>
      </div>
    </div>
  )
}
