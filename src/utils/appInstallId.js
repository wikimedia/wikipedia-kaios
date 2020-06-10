import { generateRandomId } from 'utils'

const APP_INSTALL_ID_KEY = 'app-install-id'

export const appInstallId = () => {
  let id = localStorage.getItem(APP_INSTALL_ID_KEY)
  if (!id) {
    id = generateRandomId()
    localStorage.setItem(APP_INSTALL_ID_KEY, id)
  }
  return id
}
