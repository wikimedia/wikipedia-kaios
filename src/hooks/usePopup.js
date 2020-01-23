import { useContext, useEffect } from 'preact/hooks'
import { PopupContext } from 'contexts'

export const usePopup = (component, options = {}) => {
  const { setPopupState } = useContext(PopupContext)

  useEffect(() => {
    return () => {
      // clear all the popups when the current component unmounts
      setPopupState([])
    }
  }, [])

  const close = () => {
    setPopupState(oldState => {
      const newState = [...oldState]
      newState.pop()
      return newState
    })
  }
  const show = props => {
    setPopupState(oldState => {
      let newState = [...oldState]
      const newPopup = {
        component,
        props: {
          ...props,
          close
        },
        options
      }
      if (options.stack) {
        newState.push(newPopup)
      } else {
        newState = [newPopup]
      }
      return newState
    })
  }
  return [show]
}
