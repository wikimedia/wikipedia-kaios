export const getViewport = () => {
  const article = document.querySelector('.article')

  if (article) {
    return {
      width: article.clientWidth,
      height: article.clientHeight
    }
  }

  return {
    width: window.screen.width,
    height: window.screen.height
  }
}
