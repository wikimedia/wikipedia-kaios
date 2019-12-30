import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { getArticleFooter } from 'api'

export const ArticleFooter = ({ lang, title }) => {
  const [footer, setFooter] = useState([])

  useEffect(() => {
    getArticleFooter(lang, title)
      .then(items => setFooter(items))
  }, [])

  if (!footer.length) {
    return 'Loading...'
  }

  return (
    <div class='article-footer'>
      <div class='content'>
        <h2>SUGGESTED ARTICLES</h2>
        <div class='list'>
          { footer.map(item => {
            return <a class='item' title={item.title}>
              <div class='info'>
                <div class='title'>{item.title}</div>
                <div class='description'>{item.description}</div>
              </div>
              <div class='img'><img src={item.thumbnail && item.thumbnail.source} /></div>
            </a>
          })}
        </div>
        <h2>
          <img src='https://en.m.wikipedia.org/static/images/mobile/copyright/wikipedia-wordmark-en.png' height='18' width='116' />
        </h2>
        <p class='license'>Content is available under <a class='external' rel='mw:ExtLink' href='https://creativecommons.org/licenses/by-sa/3.0/'>CC BY-SA 3.0</a> unless otherwise noted.</p>
        <p class='browser'>
          <a class='external' rel='mw:ExtLink' href={`https://${lang}.m.wikipedia.org/w/index.php?title=${title}`}>
        View article in browser
          </a>
        </p>
      </div>
    </div>
  )
}
