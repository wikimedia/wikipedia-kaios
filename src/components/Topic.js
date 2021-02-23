import { h } from 'preact'
import { useEffect } from 'preact/hooks'
// import { useI18n } from 'hooks'
// import { getTrendingArticles } from 'api'

export const Topic = ({ isExpanded, lang, containerRef }) => {
  // const [trendingArticles, setTrendingArticles] = useState([])

  useEffect(() => {
    // request topic
    // const [request, abort] = getTrendingArticles(lang)
    // request.then(setTrendingArticles)
    // return abort
  })

  return (
    <div class={`feed ${isExpanded ? 'expanded' : 'collapsed'}`} ref={containerRef}>
      {!isExpanded && <div class='cue' />}
      <TopicFeed />
    </div>
  )
}

const TopicFeed = ({ containerRef }) => {
  const topics = ['Entertainment', 'Sports', 'People', 'Science', 'Culture', 'Places', 'Society']

  return (
    <div class='topics' >
      {topics.map(topic => (
        <div class='topic' data-selectable>
          {topic}
        </div>
      ))}
    </div>
  )
}
