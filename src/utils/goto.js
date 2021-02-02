import { route } from 'preact-router'
import { canonicalizeTitle, getAppLanguage } from 'utils'
import { getRandomArticleTitle } from 'api'

const article = (lang, title, replace = false) => {
  if (!Array.isArray(title)) {
    title = [title]
  }
  const titleStr = title.map(t => encodeURIComponent(canonicalizeTitle(t))).join('/')
  route(`/article/${lang}/${titleStr}`, replace)
}

const search = () => route('/')

const consent = () => route('/consent')

const settings = () => route('/settings')

const tips = () => route('/tips')

const termsOfUse = () => {
  const lang = getAppLanguage()
  window.open(`https://foundation.m.wikimedia.org/wiki/Terms_of_Use/${lang}`)
}

const privacyPolicy = () => {
  window.open('https://foundation.m.wikimedia.org/wiki/Privacy_policy')
}

const randomArticle = (closePopup) => {
  const lang = getAppLanguage()
  const [promise] = getRandomArticleTitle(lang)

  promise.then(title => {
    if (closePopup) {
      closePopup()
    }
    article(lang, title)
  })
}

const back = () => window.history.back()

export const goto = { article, search, consent, termsOfUse, privacyPolicy, back, randomArticle, settings, tips }
