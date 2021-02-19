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
  const nextZIndex = () => {
    zIndex += 2
    return zIndex
  }
  // The shader is just before the last popup
  const shaderZIndex = 100 + popups.length * 2 - 1
  const lastIndex = popups.length - 1
  const hideOthers = popups[lastIndex].options.hideOthers
  return (
    <div class='popup'>
      <div class='shader' style={{ zIndex: shaderZIndex }} />
      { popups.map((popup, index) => {
        const style = {
          zIndex: nextZIndex(),
          visibility: (hideOthers && index < lastIndex) ? 'hidden' : 'visible'
        }
        return <Popup {...popup} key={popup.id} style={style} />
      }) }
    </div>
  )
}
