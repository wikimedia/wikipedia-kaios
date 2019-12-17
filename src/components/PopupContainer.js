import { h } from 'preact'

export const PopupContainer = ({ component, props, options }) => {
  if (component) {
    options = options || {}
    const style = {}
    if (options.position === 'bottom') {
      style.top = '20%'
    } else if (options.position === 'auto') {
      style.top = 'auto'
      style.maxHeight = '80vh'
    }
    return (
      <div class='popup'>
        <div class='shader' />
        <div class='popup-content' style={style}>
          { h(component, props) }
        </div>
      </div>
    )
  }
}
