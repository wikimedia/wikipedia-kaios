import { h } from 'preact'

export const Popup = ({ component, props, options, style }) => {
  if (component) {
    let contentClasses = 'popup-content'
    if (options && options.mode === 'fullscreen') {
      contentClasses += ' fullscreen'
    }
    return (
      <div class={contentClasses} style={style}>
        { h(component, props) }
      </div>
    )
  }
}

export const PopupContainer = ({ popups }) => {
  if (popups.length === 0) {
    return ''
  }
  let zIndex = 100
  const popupsBeforeShader = popups.length > 1
    ? popups.slice(0, -1) : []
  const lastPopup = popups.slice(-1)[0]
  return (
    <div class='popup'>
      { popupsBeforeShader.map(popup => <Popup {...popup} style={{ zIndex: zIndex++ }} />) }
      <div class='shader' style={{ zIndex: zIndex++ }} />
      <Popup {...lastPopup} style={{ zIndex: zIndex++ }} />
    </div>
  )
}
