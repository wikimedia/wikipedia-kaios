import { route } from 'preact-router'

const article = (lang, title, replace = false) => {
  if (!Array.isArray(title)) {
    title = [title]
  }
  const titleStr = title.map(t => encodeURIComponent(t)).join('/')
  route(`/article/${lang}/${titleStr}`, replace)
}

export const goto = { article }
