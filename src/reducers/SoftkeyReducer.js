/**
 * The softkey state object has two keys, stack and current.
 * stack is the array list of the softkey item
 * current is the current softkey item
 *
 * The "origin" in the item represent as the unique key,
 * the action use this key to find the target item in stack and current
 *
 * There are four types of action in this reducer
 *
 * Set:
 *    Set the softkey item with the new config
 * Replace:
 *    Remove and replace the existing softkey item with the new config
 * Push:
 *    Register a new softkey item or
 *    increase the counter if it is being called multiple times
 * Pop:
 *    Deregister the softkey item when the component being unmounted.
 *    It use the counter to determine whether the item is completely unmounted
 */
export const SoftkeyReducer = (state, action) => {
  let stack,
    current
  switch (action.type) {
    case 'set':
      if (action.origin === state.current.origin) {
        return { ...state, current: { ...state.current, ...action.config } }
      } else {
        const stack = [...state.stack]
        const targetIndex = stack.findIndex(s => s.origin === action.origin)
        stack[targetIndex] = { ...stack[targetIndex], ...action.config }
        return { stack, current: state.current }
      }
    case 'replace':
      // eslint-disable-next-line no-case-declarations
      const { origin, counter } = state.current
      if (action.origin === state.current.origin) {
        return { ...state, current: { origin, counter, ...action.config } }
      } else {
        const stack = [...state.stack]
        const targetIndex = stack.findIndex(s => s.origin === action.origin)
        stack[targetIndex] = { origin, counter, ...action.config }
        return { stack, current: state.current }
      }
    case 'push':
      stack = state.stack || []
      current = state.current
      if (!current) {
        current = { origin: action.origin, counter: 1 }
      } else if (current.origin !== action.origin) {
        stack.push(current)
        current = { origin: action.origin, counter: 1 }
      } else {
        current.counter++
      }
      return { stack, current }
    case 'pop':
      stack = state.stack || []
      current = state.current
      if (current.origin !== action.origin) {
        // The component order called of unmount doesn't follow the stack order
        // therefore searching for the right stack to minus the counter
        // and remove it from the stack
        let searchIndex = stack.length
        while (searchIndex--) {
          const searchStack = stack[searchIndex]
          if (searchStack.origin === action.origin) {
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
