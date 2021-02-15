#!/usr/bin/env node

const request = require('request')

const data = require(process.argv[2])

function chunk (arr, len) {
  var chunks = [],
      i = 0,
      n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }

  return chunks;
}

// console.log(JSON.stringify(data.filter(a => (a.article.indexOf(':') === -1) && (a.article !== 'Main_Page') )))

async function getRevs(titles) {
	return new Promise((resolve, reject) => {
		const url = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=ids&format=json&titles=' + encodeURIComponent(titles.join('|'))
		request(url, { json: true }, (err, res, body) => {
			if (err) {
				return reject(err)
			}
			const articlePages = Object.values(body.query.pages).filter(p => p.ns === 0)
			resolve(articlePages.map(p => {
				return {
					title: p.title,
					rev: p.revisions[0].revid
				}
			}))
		})
	})
}

function joinRevToData(revs) {
	revs.forEach(r => {
		const currentPage = data.find(p => p.article === r.title)
		if (currentPage) {
			currentPage.revision = r.rev
		} else {
			console.log(r.title, 'not found')
		}
	})
}

async function main() {
	chunk(data, 50).forEach(async function(c) {
		const titles = c.map(a => a.article)
		// console.log(titles)
		const withRevs = await getRevs(titles)
		joinRevToData(withRevs)
		console.log(data)
		process.exit()
	})
}
main()


// console.log(chunk(data, 3)[0])

// process.exit()
/*
// load pages
const inputfile = require('./topread-enwiki-20210101.json')

const articles = inputfile.items[0].articles.slice(0, 10)

const titles = articles.map(a => a.article)



function getArticleTopic(revisions) {

}


// console.log(titles)

// get latest rev id
// https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=ids&titles=Cat%7CDog%7CMouse

// get ORES articletopic
// https://ores.wikimedia.org/scores/enwiki/?models=articletopic&revids=1004436278

// Match to one of the 7 categories
*/
