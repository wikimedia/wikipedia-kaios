import { useKeys } from 'hooks'

export const useBackToSearch = () => {
  useKeys({
    Backspace: () => {
      // note: 'Backspace' is the red "hang up" button
      // Todo: encapsulate navigation instead of hardcoding URLs
      window.location.hash = '/'
    }
  })
}
