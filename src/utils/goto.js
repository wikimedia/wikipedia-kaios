import { route } from 'preact-router'
import { canonicalizeTitle, getAppLanguage, openExternal } from 'utils'

const article = (lang, title, replace = false) => {
  if (!Array.isArray(title)) {
    title = [title]
  }
  const titleStr = title.map(t => encodeURIComponent(canonicalizeTitle(t))).join('/')
  route(`/article/${lang}/${titleStr}`, replace)
}

const search = () => route('/')

const settings = () => route('/settings')

const tips = () => route('/tips')

const termsOfUse = () => {
  const lang = getAppLanguage()
  openExternal(`https://foundation.m.wikimedia.org/wiki/Terms_of_Use/${lang}`)
}

const privacyPolicy = () => {
  openExternal('https://foundation.m.wikimedia.org/wiki/Privacy_policy')
}

const back = () => window.history.back()

export const goto = { article, search, termsOfUse, privacyPolicy, back, settings, tips }
