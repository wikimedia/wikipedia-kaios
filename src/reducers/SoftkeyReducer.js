export const SoftkeyReducer = (state, action) => {
  let stack,
    current
  switch (action.type) {
    case 'set':
      return { ...state, current: { ...state.current, ...action.config } }
    case 'replace':
      // eslint-disable-next-line no-case-declarations
      const { name, counter } = state.current
      return { ...state, current: { name, counter, ...action.config } }
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
        // The component order called of unmount doesn't follow the stack order
        // therefore searching for the right stack to minus the counter
        // and remove it from the stack
        let searchIndex = stack.length
        while (searchIndex--) {
          const searchStack = stack[searchIndex]
          if (searchStack.name === action.origin) {
            searchStack.counter--
            if (searchStack.counter === 0) {
              stack.splice(searchIndex, 1)
            }
            break
          }
        }
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
