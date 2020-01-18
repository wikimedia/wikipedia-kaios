import { h } from 'preact'

export const RadioListView = ({ items = [], header, containerRef, empty }) => {
  return (
    <div class='radiolistview'>
      { header && <div class='header'>{header}</div> }
      <div class='list' ref={containerRef}>
        {
          items.length ? items.map(item => (
            <div class='item' data-selectable data-title={item.title} data-selected-key={item.title} key={item.title}>
              <div class='info'>
                <div class='title'>{item.title}</div>
                { item.description && <div class='description'>{item.description}</div> }
              </div>
              <div class={`radio ${item.isSelected ? 'selected' : ''}`} />
            </div>
          )) : <div class='empty'>{empty}</div>
        }
      </div>
    </div>
  )
}
