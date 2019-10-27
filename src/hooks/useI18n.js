import { useContext } from 'preact/hooks'
import { I18nContext } from 'contexts/I18nContext'

export const useI18n = () => useContext(I18nContext)
