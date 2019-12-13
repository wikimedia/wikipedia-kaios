import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { ListView } from 'components'
import { useNavigation, useSearch, useLanguage, useI18n, useSoftkey } from 'hooks'

export const Search = () => {
  const containerRef = useRef()
  const [current, setNavigation, getCurrent] = useNavigation('Search', containerRef, 'y')
  const lang = useLanguage()
  const [query, setQuery, searchResults] = useSearch(lang)
  const i18n = useI18n()
  const onKeyCenter = () => {
    const { index, key } = getCurrent()
    if (index) {
      window.location.hash = `/article/${lang}/${key}`
    }
  }

  useSoftkey('Search', {
    left: i18n.i18n('Settings'),
    onKeyLeft: () => { window.location.hash = '/settings' },
    center: current.type === 'DIV' ? i18n.i18n('centerkey-select') : '',
    onKeyCenter
  }, [current.type])

  useEffect(() => {
    setNavigation(0)
  }, [])

  return (
    <div class='page search'>
      <img class='double-u' src='images/w.svg' style={{ display: (searchResults ? 'none' : 'block') }} />
      <input type='text' placeholder={i18n.i18n('search-placeholder')} value={query} onInput={(e) => setQuery(e.target.value)} data-selectable />
      { searchResults && <ListView items={searchResults} containerRef={containerRef} /> }
    </div>
  )
}
