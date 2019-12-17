import { h } from 'preact'

export const PopupContainer = ({ component, props, options }) => {
  if (component) {
    options = options || {}
    const style = {}
    if (options.position === 'bottom') {
      style.top = '50%'
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
