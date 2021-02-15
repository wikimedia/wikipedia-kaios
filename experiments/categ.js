#!/usr/bin/env node

const articles = require('./articles-topics.json')

// Map from ORES category to KaiOS experiment category
const categMap = {
	'Culture.Food and drink': 'Culture',
	'Culture.Internet culture': 'Culture',
	'Culture.Linguistics': 'Culture',
	'Culture.Literature': 'Culture',
	'Culture.Media.Books': 'Culture',
	'Culture.Media.Software': 'Culture',
	'Culture.Performing arts': 'Culture',
	'Culture.Philosophy and religion': 'Culture',
	'Culture.Visual arts.Architecture': 'Culture',
	'Culture.Visual arts.Fashion': 'Culture',
	'Culture.Visual arts.Visual arts*': 'Culture',
	'Culture.Media.Entertainment': 'Entertainment',
	'Culture.Media.Films': 'Entertainment',
	'Culture.Media.Media*': 'Entertainment',
	'Culture.Media.Music': 'Entertainment',
	'Culture.Media.Radio': 'Entertainment',
	'Culture.Media.Television': 'Entertainment',
	'Culture.Media.Video games': 'Entertainment',
	'Culture.Visual arts.Comics and Anime': 'Entertainment',
	'Culture.Biography.Biography*': 'People',
	'Culture.Biography.Women': 'People',
	'Geography.Geographical': 'Places',
	'Geography.Regions.Africa.Africa*': 'Places',
	'Geography.Regions.Africa.Central Africa': 'Places',
	'Geography.Regions.Africa.Eastern Africa': 'Places',
	'Geography.Regions.Africa.Northern Africa': 'Places',
	'Geography.Regions.Africa.Southern Africa': 'Places',
	'Geography.Regions.Africa.Western Africa': 'Places',
	'Geography.Regions.Americas.Central America': 'Places',
	'Geography.Regions.Americas.North America': 'Places',
	'Geography.Regions.Americas.South America': 'Places',
	'Geography.Regions.Asia.Asia*': 'Places',
	'Geography.Regions.Asia.Central Asia': 'Places',
	'Geography.Regions.Asia.East Asia': 'Places',
	'Geography.Regions.Asia.North Asia': 'Places',
	'Geography.Regions.Asia.South Asia': 'Places',
	'Geography.Regions.Asia.Southeast Asia': 'Places',
	'Geography.Regions.Asia.West Asia': 'Places',
	'Geography.Regions.Europe.Eastern Europe': 'Places',
	'Geography.Regions.Europe.Europe*': 'Places',
	'Geography.Regions.Europe.Northern Europe': 'Places',
	'Geography.Regions.Europe.Southern Europe': 'Places',
	'Geography.Regions.Europe.Western Europe': 'Places',
	'Geography.Regions.Oceania': 'Places',
	'STEM.Biology': 'Science',
	'STEM.Chemistry': 'Science',
	'STEM.Computing': 'Science',
	'STEM.Earth and environment': 'Science',
	'STEM.Engineering': 'Science',
	'STEM.Libraries & Information': 'Science',
	'STEM.Mathematics': 'Science',
	'STEM.Medicine & Health': 'Science',
	'STEM.Physics': 'Science',
	'STEM.STEM*': 'Science',
	'STEM.Space': 'Science',
	'STEM.Technology': 'Science',
	'Culture.Sports': 'Sports',
	'History and Society.Business and economics': 'Society',
	'History and Society.Education': 'Society',
	'History and Society.History': 'Society',
	'History and Society.Military and warfare': 'Society',
	'History and Society.Politics and government': 'Society',
	'History and Society.Society': 'Society',
	'History and Society.Transportation': 'Society'
}

function getTopScore(probability) {
	let top = 0;
	let categ = null;
	Object.entries(probability).forEach(([cat, prob]) => {
		// console.log(cat, top, prob)
		if (prob > top) {
			top = prob
			categ = cat
		}
	})
	return categ
}

const articlesByTopic = {}

for (var i = 0; i < articles.length; i++) {
	const prediction = articles[i].topics.prediction.map(p => categMap[p])
	const topScore = categMap[getTopScore(articles[i].topics.probability)]
	if (prediction.length > 0 && prediction.indexOf(categMap[topScore]) === -1) {
		// console.log('ALERT', articles[i].article, prediction, categMap[topScore])
	}
	articlesByTopic[topScore] = articlesByTopic[topScore] || []
	articlesByTopic[topScore].push(articles[i].article)
	// console.log(articles[i].article, prediction, categMap[topScore])
	// console.log(JSON.stringify(articles[i].topics.probability, 4))
	if (i > 100) break;
	// break;
}

Object.keys(articlesByTopic).forEach(t => {
	console.log('==', t, '==', "\n")
	articlesByTopic[t].forEach(a => console.log('[[w:' + a + ']]', "\n"))
})

// console.log(JSON.stringify(articlesByTopic, null, 4))
