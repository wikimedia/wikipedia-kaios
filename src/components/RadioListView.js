import { h } from 'preact'

/**
 * The containerRef is suggested to be used together with the hooks useNavigation
 * without the containerRef, the view won't scroll to the selected row
 */
export const RadioListView = ({ items, containerRef }) => {
  if (!items.length) return

  return <div class='radio-list' ref={containerRef}>
    {
      items.map(item => (
        <div class='item' data-selectable data-title={item.title} data-selected-key={item.title} key={item.title}>
          <div class='info'>
            <div class='title'>{item.title}</div>
            { item.description && <div class='description'>{item.description}</div> }
          </div>
          <div class={`radio ${item.isSelected ? 'selected' : ''}`} />
        </div>

      ))
    }
  </div>
}
