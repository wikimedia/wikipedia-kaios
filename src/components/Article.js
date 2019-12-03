import { h, Fragment } from 'preact'
import { memo } from 'preact/compat'
import { useRef, useEffect, useState } from 'preact/hooks'
import { Pager } from 'components'
import { useArticle, useNavigation, useI18n, useSoftkey } from 'hooks'

const ArticleBody = memo(({ content }) => {
  return (
    <div
      class='article-content'
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
})

export const Article = ({ lang, title }) => {
  const i18n = useI18n()
  const article = useArticle(lang, title)
  const actionsRef = useRef()
  const [, setNavigation, getCurrent] = useNavigation(actionsRef, 'x')
  const softkey = useSoftkey()
  const [currentSection, setCurrentSection] = useState(0)
  const imageUrl = article && article.sections[currentSection].imageUrl

  if (!article) {
    return 'Loading...'
  }

  useEffect(() => {
    softkey.dispatch({ type: 'setLeftText', value: i18n.i18n('close') })
    softkey.dispatch({ type: 'setCenterText', value: i18n.i18n('centerkey-select') })
    softkey.dispatch({ type: 'setOnKeyLeft', event: onKeyLeft })
    softkey.dispatch({ type: 'setOnKeyCenter', event: onKeyCenter })
  }, [])

  useEffect(() => {
    setNavigation(0)
  }, [article])

  const onKeyLeft = () => {
    history.back()
  }
  const onKeyCenter = () => {
    const current = getCurrent()
    if (current.key === 'quickfacts') {
      goToQuickFacts()
    }
  }
  const goToQuickFacts = () => {
    window.location.hash = `/quickfacts/${lang}/${title}`
  }

  const pagerEvent = {
    nextPage: () => {
      const sectionLength = article.sections.length
      const nextSection = currentSection + 1

      setCurrentSection(nextSection < sectionLength ? nextSection : 0)
    },
    prevPage: () => {
      const prevSection = currentSection - 1
      if (prevSection >= 0) {
        setCurrentSection(prevSection)
      }
    }
  }

  return (
    <Fragment>
      <Pager event={pagerEvent}>
        <div class='page article'>
          { imageUrl && <div class='lead-image' style={{ backgroundImage: `url(${imageUrl})` }} /> }
          <div class={'card' + (imageUrl ? ' with-image' : '')}>
            <div class='title' dangerouslySetInnerHTML={{ __html: article.sections[currentSection].title }} />
            { article.sections[currentSection].description && (
              <Fragment>
                <div class='desc'>{article.sections[currentSection].description}</div>
                <div class='line' />
              </Fragment>
            ) }
            { currentSection === 0 && (
              <div class='article-actions' ref={actionsRef}>
                <div class='article-actions-button' data-selectable data-selected-key='sections'>
                  <img src='images/sections.svg' />
                  <label>Sections</label>
                </div>
                <div class='article-actions-button' data-selectable data-selected-key='quickfacts'>
                  <img src='images/quickfacts.svg' />
                  <label>Quick Facts</label>
                </div>
                <div class='article-actions-button' data-selectable data-selected-key='audio'>
                  <img src='images/audio.svg' />
                  <label>Audio</label>
                </div>
              </div>
            ) }
            <ArticleBody content={article.sections[currentSection].content} />
          </div>
        </div>
      </Pager>
    </Fragment>
  )
}
