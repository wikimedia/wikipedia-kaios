import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { memo } from 'preact/compat'
import { ListView } from 'components'
import { useI18n } from 'hooks'
import { getTrendingArticles } from 'api'
import { getUserCountry } from 'utils'

export const Feed = ({ lang, isExpanded, setIsExpanded, lastIndex, setNavigation, containerRef }) => {
  const [trendingArticles, setTrendingArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const i18n = useI18n()
  const userCountry = getUserCountry()

  useEffect(() => {
    setLoading(true)
    const [request, abort] = getTrendingArticles(lang, userCountry)
    request.then(articles => {
      setLoading(false)
      setTrendingArticles(articles)
    })
    return abort
  }, [lang, userCountry])

  useEffect(() => {
    if (lastIndex) {
      setIsExpanded(true)
      setNavigation(lastIndex)
    } else if (isExpanded) {
      setNavigation(1)
    }
  }, [trendingArticles, loading, isExpanded])

  const showArticles = trendingArticles.length > 0 && !loading
  const showError = trendingArticles.length === 0 && !loading

  return (
    <div class={`feed ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {!isExpanded && <div class='cue' />}
      {loading && <Loading isExpanded={isExpanded} />}
      {showArticles && <ListView items={trendingArticles} header={i18n('feed-header')} containerRef={containerRef} />}
      {showError && <Error />}
    </div>
  )
}

const Loading = memo(({ isExpanded }) => {
  const i18n = useI18n()
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
        <div class='top'>
          <div class='header'><span>{i18n('feed-header')}</span></div>
        </div>
        {loadingItem(true)}
        {loadingItem()}
        {loadingItem()}
      </div>
    )
  }

  return (
    <div class={`loading ${!isExpanded ? 'collapsed' : ''}`}>
      {isExpanded && loadingExpanded()}
    </div>
  )
})

const Error = memo(() => {
  const i18n = useI18n()
  return (
    <div class='error'>
      <img src='images/article-error.png' />
      <p class='message' data-selectable>{i18n('feed-error-message')}</p>
    </div>
  )
})
