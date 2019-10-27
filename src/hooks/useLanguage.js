import { useContext } from 'preact/hooks'
import { LanguageContext } from 'contexts/LanguageContext'

export const useLanguage = () => useContext(LanguageContext)
