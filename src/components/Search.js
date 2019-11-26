import { h, Fragment } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { ListView } from 'components'
import { useNavigation, useSearch, useLanguage, useI18n, useSoftkey } from 'hooks'

export const Search = () => {
  const containerRef = useRef()
  const [current, setNavigation, getCurrent] = useNavigation(containerRef, 'y')
  const lang = useLanguage()
  const [query, setQuery, searchResults] = useSearch(lang)
  const i18n = useI18n()
  const softkey = useSoftkey()

  const resultsPage = searchResults !== null

  useEffect(() => {
    setNavigation(0)
    softkey.dispatch({ type: 'setLeftText', value: 'Settings' })
    softkey.dispatch({ type: 'setOnKeyLeft', event: onKeyLeft })
    softkey.dispatch({ type: 'setRightText', value: '' })
  }, [])

  useEffect(() => {
    softkey.dispatch({ type: 'setCenterText', value: current.type === 'INPUT' ? '' : i18n.i18n('centerkey-select') })
    softkey.dispatch({ type: 'setOnKeyCenter', event: onKeyCenter })
  }, [current.type])

  const onKeyLeft = () => {
    window.location.hash = '/settings'
  }

  const onKeyCenter = () => {
    const { index, key } = getCurrent()
    if (index) {
      window.location.hash = `/article/${lang}/${key}`
    }
  }

  return (
    <Fragment>
      <div class='page search'>
        <img class='double-u' src='images/w.svg' style={{ display: (resultsPage ? 'none' : 'block') }} />
        <input type='text' placeholder={i18n.i18n('search-placeholder')} value={query} onInput={(e) => setQuery(e.target.value)} data-selectable />
        { resultsPage && <ListView items={searchResults} containerRef={containerRef} /> }
      </div>
    </Fragment>
  )
}
