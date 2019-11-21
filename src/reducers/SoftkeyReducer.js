export const SoftkeyReducer = (state, action) => {
  switch (action.type) {
    case 'setLeftText':
      return { ...state, left: action.value }
    case 'setCenterText':
      return { ...state, center: action.value }
    case 'setRightText':
      return { ...state, right: action.value }
    case 'setOnKeyCenter':
      return { ...state, onKeyCenter: action.event }
    case 'setOnKeyLeft':
      return { ...state, onKeyLeft: action.event }
    case 'setOnKeyRight':
      return { ...state, onKeyRight: action.event }
    default:
      return state
  }
}
