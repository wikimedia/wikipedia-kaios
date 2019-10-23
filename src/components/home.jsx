import { h, Fragment } from 'preact'
import { Softkey } from 'components/softkey'
import { useNavigation } from 'hooks/useNavigation'

const Home = () => {
  useNavigation()

  const onKeyCenter = () => {
    const element = document.querySelector('[nav-selected=true]')
    window.location.hash = element.getAttribute('href')
  }

  return (
    <Fragment>
      <div class='home'>
        <a href='#/fr/Chat' nav-selectable>Chat (fr)</a>
        <a href='#/en/The_Captain_from_Cologne' nav-selectable>The Captain from Cologne (en)</a>
        <a href='#/es/Lawrence_de_Arabia_(película)' nav-selectable>Lawrence de Arabia (película) (es)</a>
        <a href='#/es/Dellamora_palposa' nav-selectable>Dellamora palposa (es)</a>
      </div>
      <Softkey
        center='read'
        onKeyCenter={onKeyCenter}
      />
    </Fragment>
  )
}

export default Home
