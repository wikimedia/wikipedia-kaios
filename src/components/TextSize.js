import { h } from 'preact'
import { useI18n, useSoftkey } from 'hooks'

export const TextSize = ({ close }) => {
  const i18n = useI18n()

  useSoftkey('TextSize', {
    left: i18n('softkey-close'),
    onKeyLeft: close
  })

  return <div class='textsize'>
    <div class='header'>{i18n('header-textsize')}</div>
    <div class='content'>
      <p>{i18n('textsize-decrease')}</p>
      <p>{i18n('textsize-default')}</p>
      <p>{i18n('textsize-increase')}</p>
    </div>
  </div>
}
