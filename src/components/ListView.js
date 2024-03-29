import { h } from 'preact'
import { memo } from 'preact/compat'

/**
 * The containerRef is suggested to be used together with the hooks useNavigation
 * without the containerRef, the view won't scroll to the selected row
 */
export const ListView = memo(({ items = [], header, containerRef, empty }) => {
  return (
    <div class='listview'>
      { header && <div class='header'>{header}</div> }
      <div class='list' ref={containerRef}>
        {
          items.length ? items.map(item => (
            <div class='item' dir={item.dir} data-selectable data-title={item.title} data-selected-key={item.title} key={item.title}>
              <div class='info'>
                <bdi class='title' dangerouslySetInnerHTML={{ __html: item.displayTitle || item.title }} />
                { item.description && <bdi class={`description${item.imageUrl ? ' withImg' : ''}`} dangerouslySetInnerHTML={{ __html: item.description }} /> }
              </div>
              { item.imageUrl && <div class='img' style={{ backgroundImage: `url(${item.imageUrl})` }} /> }
              { item.link && <div class='link'><img src='images/link.svg' /></div> }
            </div>
          )) : <div class='empty'>{empty}</div>
        }
      </div>
    </div>
  )
})
