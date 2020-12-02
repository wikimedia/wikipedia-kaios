import { useContext } from 'preact/hooks'
import { PopupContext } from 'contexts'

export const usePopup = (component, options = {}) => {
  const { setPopupState } = useContext(PopupContext)

  const close = () => {
    setPopupState(oldState => {
      const newState = [...oldState]
      newState.pop()
      return newState
    })
  }

  const closeAll = () => {
    setPopupState([])
  }

  const show = props => {
    setPopupState(oldState => {
      let newState = [...oldState]
      const newPopup = {
        component,
        props: {
          ...props,
          close,
          closeAll
        },
        options,
        id: component.name
      }
      if (options.stack) {
        // prevent showing duplicate component
        if (!newState.find(state => state.id === newPopup.id)) {
          newState.push(newPopup)
        }
      } else {
        newState = [newPopup]
      }
      return newState
    })
  }
  return [show]
}
