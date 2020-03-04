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

  const setPrevValue = () => {
    setRangeValue(value - 1)
  }

  const setNextValue = () => {
    setRangeValue(value + 1)
  }

  return [value, setPrevValue, setNextValue, setRangeValue]
}
