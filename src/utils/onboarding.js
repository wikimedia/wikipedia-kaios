const KEY = 'onboard-before'

const get = () => {
  return !localStorage.getItem(KEY)
}

const set = value => {
  localStorage.setItem(KEY, Boolean(value))
}

export const onboarding = { get, set }
