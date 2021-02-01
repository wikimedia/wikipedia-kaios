import { useState } from 'preact/hooks'

export const useHistoryState = (key, initialValue) => {
  const [current, setCurrent] = useState(() => {
    return (window.history.state && window.history.state[key])
      ? window.history.state[key]
      : initialValue
  })
  const setCurrentWrapper = (value) => {
    setCurrent(value)
    const state = window.history.state || {}
    state[key] = value
    window.history.replaceState(state, null, null)
  }
  return [current, setCurrentWrapper]
}
