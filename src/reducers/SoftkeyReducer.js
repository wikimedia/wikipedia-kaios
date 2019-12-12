export const SoftkeyReducer = (state, action) => {
  let stack,
    current
  switch (action.type) {
    case 'set':
      return { ...state, current: { ...state.current, ...action.config } }
    case 'setLeftText':
      return { ...state, current: { ...state.current, left: action.value } }
    case 'setCenterText':
      return { ...state, current: { ...state.current, center: action.value } }
    case 'setRightText':
      return { ...state, current: { ...state.current, right: action.value } }
    case 'setOnKeyCenter':
      return { ...state, current: { ...state.current, onKeyCenter: action.event } }
    case 'setOnKeyLeft':
      return { ...state, current: { ...state.current, onKeyLeft: action.event } }
    case 'setOnKeyRight':
      return { ...state, current: { ...state.current, onKeyRight: action.event } }
    case 'push':
      stack = state.stack || []
      if (state.current) {
        stack.push(state.current)
      }
      return { stack, current: {} }
    case 'pop':
      stack = state.stack || []
      current = stack.length > 0 ? stack.pop() : {}
      return { stack, current }
    default:
      return state
  }
}
