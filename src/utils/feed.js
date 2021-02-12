// const KEY = ''

const getFeedElement = () => document.querySelector('.feed')

const isFeedExpanded = () => {
  return localStorage.getItem('is-feed-expanded') === 'true'
}

const expandFeed = () => {
  // update feed: add expanded, remove collapsed
  const feed = getFeedElement()
  console.log('expandFeed - feed...', feed)
  feed.classList.replace('collapsed', 'expanded')
  localStorage.setItem('is-feed-expanded', true)
}

const collapseFeed = () => {
  // update feed: add collapsed, removed expanded
  const feed = getFeedElement()
  console.log('collapseFeed - feed...', feed)
  feed.classList.replace('expanded', 'collapsed')
  localStorage.setItem('is-feed-expanded', false)
}

export { expandFeed, collapseFeed, isFeedExpanded }
