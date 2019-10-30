import { useContext } from 'preact/hooks'
import { LanguageContext } from 'contexts'

export const useLanguage = () => useContext(LanguageContext)
