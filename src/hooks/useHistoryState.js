import { useState } from 'preact/hooks'

export const useHistoryState = (key, initialValue) => {
  const [current, setCurrent] = useState(() => {
    return (history.state && history.state[key])
      ? history.state[key]
      : initialValue
  })
  const setCurrentWrapper = (value) => {
    setCurrent(value)
    const state = history.state || {}
    state[key] = value
    history.replaceState(state, null, null)
  }
  return [current, setCurrentWrapper]
}
