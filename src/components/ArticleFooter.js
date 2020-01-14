import { h } from 'preact'
import { useI18n } from 'hooks'
import { buildWpMobileWebUrl } from 'utils'

export const ArticleFooter = ({ lang, title, items = [] }) => {
  const i18n = useI18n()

  return (
    <div class='article-footer'>
      <div class='content'>
        <h2>{i18n.i18n('suggested-articles')}</h2>
        <div class='list'>
          { items.map(item => {
            return <a class='item' title={item.title}>
              <div class='info'>
                <div class='article-title adjustable-font-size'>{item.title}</div>
                <div class='description adjustable-font-size'>{item.description}</div>
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
