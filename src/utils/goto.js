import { route } from 'preact-router'
import { canonicalizeTitle } from 'utils'

const article = (lang, title, replace = false) => {
  if (!Array.isArray(title)) {
    title = [title]
  }
  const titleStr = title.filter(t => t).map(t => encodeURIComponent(canonicalizeTitle(t))).join('/')
  route(`/article/${lang}/${titleStr}`, replace)
}

export const goto = { article }
