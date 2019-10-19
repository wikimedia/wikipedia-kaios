
function getArticle( lang, title ) {
	const url = 'https://' + lang + '.wikipedia.org/api/rest_v1/page/mobile-sections/' + title;
	return fetch( url ).then( ( response ) => response.json() );
}

export {
	getArticle
};
