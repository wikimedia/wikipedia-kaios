const GROUP_STORAGE_KEY = '2021-KaiOS-app-homepage-content-suggestions'

export const USER_COUNTRY_STORAGE_KEY = 'user-country'

const GROUPS = [
  'control',
  'trending-articles'
]

const getRandomGroupNumber = () => {
  // Groups distribution can be observed by running:
  // var groups = [0,0];
  // for (var i=0; i<9999; i++) {
  //   groups[Math.round(Math.random()*100)%2]++;
  // }
  // console.log(groups);
  return Math.round(Math.random() * 100) % GROUPS.length
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
    name: GROUP_STORAGE_KEY,
    group: getGroup()
  }
}

export const isTrendingArticlesGroup = () => getGroup() === GROUPS[1]
