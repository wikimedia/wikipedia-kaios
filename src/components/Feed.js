import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { isTrendingArticlesGroup, isCuratedTopicsGroup } from 'utils'
import { ListView } from 'components'
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
      {isTrendingArticlesGroup() && <ListView items={trendingArticles} header={i18n('feed-header')} containerRef={containerRef} />}
      {isCuratedTopicsGroup() && <TopicFeed />}
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
