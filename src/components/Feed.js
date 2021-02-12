import { h } from 'preact'
import { isFeedExpanded } from 'utils'

export const Feed = () => {
  console.log('isFeedExpanded... ', isFeedExpanded())
  return (
    <div class='feed collapsed'>
      feed
    </div>
  )
}
