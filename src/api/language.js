
const load = (lang) => {
  return new Promise((resolve, reject) => {
    fetch('i18n/' + lang + '.json')
      .then((response) => response.json())
      .then((json) => {
        resolve({ [lang]: json })
      })
      .catch(() => {
        // It is expected that some languages don't have an i18n file.
        // Since this is used in the context of Promise.all,
        // it is better to resolve empty than reject.
        resolve({})
      })
  })
}

const loadMessages = (lang) => {
  const langs = [lang]
  if (lang !== 'en') {
    langs.push('en')
  }
  return Promise.all(langs.map(load))
    .then((messages) => Object.assign.apply({}, messages))
}

export {
  loadMessages
}
