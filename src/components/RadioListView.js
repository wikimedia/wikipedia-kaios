import { h } from 'preact'

export const RadioListView = ({ items = [], header, containerRef, empty }) => {
  return (
    <div class='radiolistview'>
      { header && <div class='header'>{header}</div> }
      <div class='list' ref={containerRef}>
        {
          items.length ? items.map(item => {
            let title
            Array.isArray(item.title) ? title = item.title[0] : title = item.title
            return (
              <div class='item' data-selectable data-title={title} data-selected-key={title} key={title}>
                <div class='info'>
                  <div class='title'>{title}</div>
                  { item.description && <div class='description'>{item.description}</div> }
                </div>
                <div class='radio-container'>
                  <div class={`radio ${item.isSelected ? 'selected' : ''}`} />
                </div>
              </div>
            )
          }) : <div class='empty'>{empty}</div>
        }
      </div>
    </div>
  )
}
