import Banana from 'banana-i18n';

const lang = navigator.language.substr( 0, 2 );
const banana = new Banana( lang );
fetch( 'i18n/' + lang + '.json' )
	.then( ( response ) => response.json() )
	.then( ( messages ) => banana.load( messages, lang ) )
	.then( () => {
		const root = document.querySelector('#root');
		root.innerText = banana.i18n( 'app-title' );
	} );
