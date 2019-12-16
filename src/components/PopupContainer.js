import { h } from 'preact'

export const PopupContainer = ({ component, props }) => {
  if (component) {
    return h(component, props)
  }
}
