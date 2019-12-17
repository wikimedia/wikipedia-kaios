import { useContext } from 'preact/hooks'
import { PopupContext } from 'contexts'

export const usePopup = (component, options = {}) => {
  const { setPopupState } = useContext(PopupContext)
  const show = props => {
    setPopupState({
      component,
      props: {
        ...props,
        close: () => {
          setPopupState(null)
        }
      },
      options
    })
  }
  return [show]
}
