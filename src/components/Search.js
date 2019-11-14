import { h, Fragment } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { Softkey } from 'components'
import { useNavigation, useSearch, useLanguage, useI18n } from 'hooks'

export const Search = () => {
  const containerRef = useRef()
  const [current, setNavigation] = useNavigation(containerRef, 'y')
  const lang = useLanguage()
  const [query, setQuery, searchResults] = useSearch(lang)
  const i18n = useI18n()

  const resultsPage = searchResults !== null

  useEffect(() => {
    setNavigation(0)
  }, [])

  const onKeyCenter = () => {
    const element = document.querySelector('[nav-selected=true][data-title]')
    if (element) {
      const title = element.getAttribute('data-title')
      window.location.hash = `/article/${lang}/${title}`
    }
  }

  return (
    <Fragment>
      <div class='page search'>
        <img class='double-u' src='images/w.svg' style={{ display: (resultsPage ? 'none' : 'block') }} />
        <input type='text' placeholder={i18n.i18n('search-placeholder')} value={query} onInput={(e) => setQuery(e.target.value)} data-selectable />
        { resultsPage && (
          <div class='results' ref={containerRef}>
            { searchResults.map((r) => (
              <div class='result' data-selectable data-title={r.title} data-selected-key={r.title} key={r.title}>
                <div class='info'>
                  <div class='title' dangerouslySetInnerHTML={{ __html: r.titleHtml }} />
                  <div class='description'>{r.description}</div>
                </div>
                { r.imageUrl && <div class='img'><img src={r.imageUrl} /></div> }
              </div>
            )) }
          </div>
        ) }
      </div>
      <Softkey
        left='Settings'
        center={current.type === 'INPUT' ? '' : i18n.i18n('centerkey-select')}
        onKeyCenter={onKeyCenter}
      />
    </Fragment>
  )
}
