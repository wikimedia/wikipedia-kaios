
export const canonicalizeTitle = title => {
  return String(title).split(' ').join('_')
}
