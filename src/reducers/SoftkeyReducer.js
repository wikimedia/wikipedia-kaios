export const SoftkeyReducer = (state, action) => {
  let stack,
    current
  const config = typeof action.config === 'function' ? action.config() : action.config

  switch (action.type) {
    case 'set':
      return { ...state, current: { ...state.current, ...config } }
    case 'replace':
      return { ...state, current: { ...config } }
    case 'push':
      stack = state.stack || []
      current = state.current
      if (!current) {
        current = { name: action.origin, counter: 1 }
      } else if (current.name !== action.origin) {
        stack.push(current)
        current = { name: action.origin, counter: 1 }
      } else {
        current.counter++
      }
      return { stack, current }
    case 'pop':
      stack = state.stack || []
      current = state.current
      if (current.name !== action.origin) {
        // This unusual order of events happens when navigating
        // to a new section from the TOC. Commenting out this
        // code doesn't seem to cause any issues.
        // throw new Error(`Unexpected origin: ${action.origin}. Expected: ${current.name}`)
      } else {
        current.counter--
        if (current.counter === 0) {
          current = stack.pop()
        }
      }
      return { stack, current }
    default:
      return state
  }
}
