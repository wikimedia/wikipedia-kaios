import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { isTrendingArticlesGroup, isCuratedTopicsGroup } from 'utils'
import { useI18n } from 'hooks'
import { getTrendingArticles } from 'api'

export const Feed = ({ isExpanded, lang, containerRef }) => {
  const [trendingArticles, setTrendingArticles] = useState([])
  const i18n = useI18n()

  useEffect(() => {
    const [request, abort] = getTrendingArticles(lang)
    request.then(setTrendingArticles)
    return abort
  })

  return (
    <div class={`feed ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {!isExpanded && <div class='cue' />}
      <div class='header'>{i18n('feed-header')}</div>
      {isTrendingArticlesGroup() && <ListFeed items={trendingArticles} containerRef={containerRef} isExpanded={isExpanded} />}
      {isCuratedTopicsGroup() && <TopicFeed />}
    </div>
  )
}

const ListFeed = ({ items, containerRef, isExpanded }) => {
  // TODO: dir={item.dir} ?
  return (
    <div class={`trending-list ${isExpanded ? 'expanded' : 'collapsed'}`} ref={containerRef}>
      {
        items.length ? items.map(item => (
          <div class='item ' data-selectable data-title={item.title} data-selected-key={item.title} key={item.title}>
            <div class='info'>
              <bdi class='title' dangerouslySetInnerHTML={{ __html: item.displayTitle || item.title }} />
              { item.description && <bdi class='description' dangerouslySetInnerHTML={{ __html: item.description }} /> }
            </div>
            { item.thumb && <div class='img' style={{ backgroundImage: `url(${item.thumb})` }} /> }
          </div>
        )) : null
      }
    </div>
  )
}

const TopicFeed = () => {
  return (
    <div>
      TODO: topic feed
    </div>
  )
}
