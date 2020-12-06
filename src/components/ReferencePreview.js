import { h } from 'preact'
import { useRef } from 'preact/hooks'
import { useI18n, useSoftkey, useArticleLinksNavigation } from 'hooks'

export const ReferencePreview = ({ reference, lang, dir, close }) => {
  const i18n = useI18n()
  const contentRef = useRef()
  useArticleLinksNavigation('ReferencePreview', lang, contentRef)
  useSoftkey('ReferencePreview', {
    left: i18n('softkey-close'),
    onKeyLeft: close,
    onKeyBackspace: close
  }, [])

  return (
    <div class='reference-preview adjustable-font-size' dir={dir} ref={contentRef}>
      <div class='ref-title'>{i18n('reference-title', reference.number)}</div>
      <div class='ref-content'>
        <bdi dangerouslySetInnerHTML={{ __html: reference.content }} />
      </div>
    </div>
  )
}
