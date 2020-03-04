import { useState } from 'preact/hooks'

export const useRange = (initialValue, range) => {
  const [value, setValue] = useState(initialValue)

  const [min, max] = Array.isArray(range) ? range : [0, range]
  const setRangeValue = newValue => {
    if (newValue < min) {
      setValue(min)
    } else if (newValue > max) {
      setValue(max)
    } else {
      setValue(newValue)
    }
  }
  return [value, setRangeValue]
}
