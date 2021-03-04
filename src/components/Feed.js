import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { ListView } from 'components'
import { useI18n } from 'hooks'
import { getTrendingArticles } from 'api'

export const Feed = ({ lang, isExpanded, setIsExpanded, lastIndex, setNavigation, containerRef }) => {
  const [trendingArticles, setTrendingArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const i18n = useI18n()

  useEffect(() => {
    setLoading(true)
    const [request, abort] = getTrendingArticles(lang)
    request.then(articles => {
      setLoading(false)
      setTrendingArticles(articles)
    })
    return abort
  }, [])

  useEffect(() => {
    if (lastIndex) {
      setIsExpanded(true)
      setNavigation(lastIndex)
    }
  }, [trendingArticles])

  useEffect(() => {
    if (isExpanded) {
      setNavigation(1)
    }
  }, [loading, isExpanded])

  return (
    <div class={`feed ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {!isExpanded && <div class='cue' />}
      {!loading && <ListView items={trendingArticles} header={i18n('feed-header')} containerRef={containerRef} />}
      {loading && <Loading isExpanded={isExpanded} />}
    </div>
  )
}

const Loading = ({ isExpanded }) => {
  const loadingExpanded = () => {
    const loadingItem = (selectable = false) => {
      return (
        <div class='item' data-selectable={selectable}>
          <div class='bars'>
            <div class='bar' />
            <div class='smaller bar' />
          </div>
          <div class='rectangle' />
        </div>
      )
    }

    return (
      <div class='expanded'>
        {loadingItem(true)}
        {loadingItem()}
        {loadingItem()}
      </div>
    )
  }

  return (
    <div class='loading'>
      {!isExpanded && <div class='collapsed' />}
      {isExpanded && loadingExpanded()}
    </div>
  )
}
