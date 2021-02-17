const GROUP_STORAGE_KEY = 'experiment-group'

const GROUPS = [
  'control',
  'trending-articles',
  'curated-topics'
]

const getRandomGroupNumber = () => {
  // Groups distribution can be observed by running:
  // var groups = [0,0,0];
  // for (var i=0; i<9999; i++) {
  //   groups[Math.round(Math.random()*100)%3]++;
  // }
  // console.log(groups);
  return Math.round(Math.random() * 100) % 3
}

const getGroup = () => {
  let currentGroup = localStorage.getItem(GROUP_STORAGE_KEY)
  if (!currentGroup) {
    currentGroup = GROUPS[getRandomGroupNumber()]
    localStorage.setItem(GROUP_STORAGE_KEY, currentGroup)
  }
  return currentGroup
}

export const getExperiment = () => {
  return {
    name: '2021-KaiOS-app-homepage-content-suggestions',
    group: getGroup()
  }
}

export const isTrendingArticlesGroup = () => getGroup() === GROUPS[1]

export const isCuratedTopicsGroup = () => getGroup() === GROUPS[2]