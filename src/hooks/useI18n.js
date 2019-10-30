import { useContext } from 'preact/hooks'
import { I18nContext } from 'contexts'

export const useI18n = () => useContext(I18nContext)
