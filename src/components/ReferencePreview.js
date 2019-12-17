import { h } from 'preact'
import { useRef } from 'preact/hooks'
import { useI18n, useSoftkey, useArticleLinksNavigation } from 'hooks'

export const ReferencePreview = ({ reference, lang, close }) => {
  const i18n = useI18n()
  const contentRef = useRef()
  useArticleLinksNavigation('ReferencePreview', lang, contentRef, 1)
  useSoftkey('ReferencePreview', {
    left: i18n.i18n('close'),
    onKeyLeft: close
  }, [])

  return (
    <div class='reference-preview' ref={contentRef}>
      <div class='ref-title'>{i18n.i18n('reference-title', reference.number)}</div>
      <div class='ref-content' dangerouslySetInnerHTML={{ __html: reference.content }} />
    </div>
  )
}
