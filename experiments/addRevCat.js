#!/usr/bin/env node

const request = require('request')

async function getRevs(titles) {
	return new Promise((resolve, reject) => {
		const url = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=ids&format=json&titles=' + encodeURIComponent(titles.join('|'))
		request(url, { json: true }, (err, res, body) => {
			if (err) {
				return reject(err)
			}
			// console.log('getRevs', url, body.query.pages)
			const articlePages = Object.values(body.query.pages).filter(p => p.ns === 0)
			const result = articlePages.map(p => {
				return {
					title: p.title,
					pageId: p.pageid,
					revId: p.revisions[0].revid
				}
			})
			// console.log('getRevs', result)
			resolve(result)
		})
	})
}


async function getArticleTopics(revId) {
	return new Promise((resolve, reject) => {
		const url = 'https://ores.wikimedia.org/scores/enwiki/?models=articletopic&revids=' + revId
		request(url, { json: true }, (err, res, body) => {
			if (err) {
				return reject(err)
			}
			// console.log('getArticleTopics', url, body)
			resolve(body[revId].articletopic)
		})
	})
}

async function main() {
	const inputfile = require('./topread-enwiki-20210101.json');
	const articles = inputfile.items[0].articles.filter(a => {
		return (a.article.indexOf(':') === -1) && (a.article !== 'Main_Page');
	});

	for (var i = 0; i < articles.length; i++) {
		const article = articles[i];
		// console.log(article);
		const rev = await getRevs([ articles[i].article ])
		articles[i].pageId = rev[0].pageId
		articles[i].revId = rev[0].revId

		const topics = await getArticleTopics(rev[0].revId)
		articles[i].topics = topics

		// console.log(articles[i]);
		// break;
	}

	console.log(JSON.stringify(articles))
}
main();

// load pages



// const titles = articles.map(a => a.article)






// console.log(titles)

// get latest rev id
// https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=ids&titles=Cat%7CDog%7CMouse

// get ORES articletopic
// https://ores.wikimedia.org/scores/enwiki/?models=articletopic&revids=1004436278

// Match to one of the 7 categories

