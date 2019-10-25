import { h, Fragment } from 'preact'
import { Softkey } from 'components/softkey'
import { useNavigation } from 'hooks/useNavigation'
import { useSearch } from 'hooks/useSearch'

export const Search = () => {
  useNavigation()
  const [searchResults, setQuery] = useSearch('en')

  const hasResults = searchResults.length

  const onKeyCenter = () => {
    const element = document.querySelector('[nav-selected=true][x-url]')
    if (element) {
      window.location.hash = element.getAttribute('x-url')
    }
  }

  return (
    <Fragment>
      <div class='page search' key='search'>
        <img class='double-u' src='images/w.svg' style={{ display: (hasResults ? 'none' : 'block') }} />
        <input type='text' placeholder='Search' onInput={(e) => setQuery(e.target.value)} nav-selectable />
        { hasResults ? (
          <div class='results'>
            { searchResults.map((r) => (
              <div class='result' nav-selectable x-url={'/en/' + r.title}>
                <div class='info'>
                  <div class='title' dangerouslySetInnerHTML={{ __html: r.titleHtml }} />
                  <div class='description'>{r.description}</div>
                </div>
                <div class='img'><img src={r.imageUrl} /></div>
              </div>
            )) }
          </div>
        ) : ''}
      </div>
      <Softkey
        left='Settings'
        center={hasResults ? 'Select' : ''}
        onKeyCenter={onKeyCenter}
      />
    </Fragment>
  )
}
