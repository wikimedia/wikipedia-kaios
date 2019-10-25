import { useContext } from 'preact/hooks'
import { LanguageContext } from '../LanguageContext'

export const useLanguage = () => useContext(LanguageContext)
