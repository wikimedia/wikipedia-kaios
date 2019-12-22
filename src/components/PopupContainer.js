import { h } from 'preact'

export const PopupContainer = ({ component, props, options }) => {
  if (component) {
    let contentClasses = 'popup-content'
    if (options && options.mode === 'fullscreen') {
      contentClasses += ' fullscreen'
    }
    return (
      <div class='popup'>
        <div class='shader' />
        <div class={contentClasses}>
          { h(component, props) }
        </div>
      </div>
    )
  }
}
