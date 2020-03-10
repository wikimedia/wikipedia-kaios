import { allLanguages } from 'utils'
import en from 'i18n/en.json'
import fr from 'i18n/fr.json'
import es from 'i18n/es.json'
import hi from 'i18n/hi.json'
import pt from 'i18n/pt.json'

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

const loadAllLanguagesMessages = () => {
  return Promise.all(allLanguages.map((language) => {
    return load(language.lang)
  }))
    .then((allMessages) => {
      return Object.assign.apply({}, allMessages)
    })
}

const loadSupportedLanguageMessages = () => {
  return { en, fr, es, hi, pt }
}

export {
  loadMessages,
  loadAllLanguagesMessages,
  loadSupportedLanguageMessages
}
