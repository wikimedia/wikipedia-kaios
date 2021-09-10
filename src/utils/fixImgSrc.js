
export const fixImgSrc = (originalSrc, lang) => {
  let src = originalSrc

  // extensions relative path
  src = src.replace(/^\/w\/extensions\//gi, `https://${lang}.wikipedia.org/w/extensions/`)

  // protocol relative path
  if (src.startsWith('//')) {
    src = 'https:' + src
  }

  return src
}
