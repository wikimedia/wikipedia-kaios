import Banana from 'banana-i18n';
import { getArticle } from './mwapi';

const lang = navigator.language.substr( 0, 2 );
const banana = new Banana( lang );
fetch( 'i18n/' + lang + '.json' )
	.then( ( response ) => response.json() )
	.then( ( messages ) => banana.load( messages, lang ) )
	.then( () => {
		// const root = document.querySelector('#root');
		// root.innerText = banana.i18n( 'app-title' );
	} );

const root = document.querySelector('#root');

const parts = window.location.hash.match( /#\/(.*)\/(.*)/ );

if ( parts && parts.length === 3 ) {
	getArticle( parts[1], parts[2] )
		.then( ( data ) => {
			console.log( data );
			const imgUrl = data.lead.image.urls['320'];
			const title = data.lead.displaytitle;
			const desc = data.lead.description;
			root.innerHTML = '<div class="article"><img src="' + imgUrl + '" /><div class="card">' +
				'<div class="title">' + title + '</div>' +
				'<div class="desc">' + desc + '</div></div></div>';
		} );
}
