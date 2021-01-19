import { h } from 'preact'
import { useI18n } from 'hooks'
import { buildWpMobileWebUrl, canonicalizeTitle } from 'utils'

export const ArticleFooter = ({ lang, title, items = [], dir }) => {
  const contentI18n = useI18n(lang)
  const headerTitle = contentI18n('toc-footer')

  return (
    <div class='article-footer'>
      <div class='content'>
        <h2 class='footer-title' data-anchor={canonicalizeTitle(headerTitle)}>{headerTitle}</h2>
        <div class='list'>
          { items.map(item => {
            return (
              <a class='item' dir={dir} title={item.title} key={item.title}>
                <div class='info'>
                  <div class='article-title'>{item.title}</div>
                  <div class='description'>{item.description}</div>
                </div>
                { item.thumbnail && <div class='img'><img src={item.thumbnail.source} /></div> }
              </a>
            )
          })}
        </div>
        <h2 class='img'>
          <img src='/images/wikipedia-wordmark-en.png' height='18' width='116' />
        </h2>
        <p class='license' dangerouslySetInnerHTML={{ __html: contentI18n('content-license') }} />
        <p class='browser'>
          <a class='external' rel='mw:ExtLink' href={buildWpMobileWebUrl(lang, title)}>
            {contentI18n('view-in-browser')}
          </a>
        </p>
      </div>
    </div>
  )
}
