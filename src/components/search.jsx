import { h, Fragment } from 'preact'
import { useRef } from 'preact/hooks'
import { Softkey } from 'components/softkey'
import { useNavigation } from 'hooks/useNavigation'
import { useSearch } from 'hooks/useSearch'
import { useLanguage } from 'hooks/useLanguage'
import { useI18n } from 'hooks/useI18n'

export const Search = () => {
  const containerRef = useRef()
  const [current] = useNavigation(containerRef)
  const lang = useLanguage()
  const [searchResults, setQuery] = useSearch(lang)
  const i18n = useI18n()

  const resultsPage = searchResults !== null

  const onKeyCenter = () => {
    const element = document.querySelector('[nav-selected=true][x-url]')
    if (element) {
      window.location.hash = element.getAttribute('x-url')
    }
  }

  return (
    <Fragment>
      <div class='page search' key='search'>
        <img class='double-u' src='images/w.svg' style={{ display: (resultsPage ? 'none' : 'block') }} />
        <input type='text' placeholder={i18n.i18n('search-placeholder')} onInput={(e) => setQuery(e.target.value)} nav-selectable />
        { resultsPage ? (
          <div class='results' ref={containerRef}>
            { searchResults.map((r) => (
              <div class='result' nav-selectable x-url={'/' + lang + '/' + r.title}>
                <div class='info'>
                  <div class='title' dangerouslySetInnerHTML={{ __html: r.titleHtml }} />
                  <div class='description'>{r.description}</div>
                </div>
                { r.imageUrl && <div class='img'><img src={r.imageUrl} /></div> }
              </div>
            )) }
          </div>
        ) : ''}
      </div>
      <Softkey
        left='Settings'
        center={current.type === 'INPUT' ? '' : i18n.i18n('search-select')}
        onKeyCenter={onKeyCenter}
      />
    </Fragment>
  )
}
