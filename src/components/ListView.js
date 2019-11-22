import { h } from 'preact'

/**
 * The containerRef is suggested to be used together with the hooks useNavigation
 * without the containerRef, the view won't scroll to the selected row
 */
export const ListView = ({ items, containerRef }) => {
  if (!items.length) return
  return <div class='list' ref={containerRef}>
    {
      items.map(item => (
        <div class='item' data-selectable data-title={item.title} data-selected-key={item.title} key={item.title}>
          <div class='info'>
            <div class='title' dangerouslySetInnerHTML={{ __html: item.titleHtml }} />
            <div class='description'>{item.description}</div>
          </div>
          { item.imageUrl && <div class='img'><img src={item.imageUrl} /></div> }
        </div>

      ))
    }
  </div>
}
