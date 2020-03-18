
const fs = require('fs')

let manifest = JSON.parse(fs.readFileSync('manifest.webapp'))

// Set app info (name, subtitle, desc) in all languages available
manifest.locales = {}
fs.readdirSync('./i18n').forEach(file => {
	if (file === 'qqq.json') {
		return
	}
	const lang = file.substr(0, file.indexOf('.'))
	const messages = require('../i18n/' + file)

	manifest.locales[lang] = {
		name: messages['app-title'],
		subtitle: messages['app-subtitle'],
		description: messages['app-description']
	}

	if (lang === 'en') {
		manifest.name = messages['app-title']
		manifest.description = messages['app-description']
	}
});

// Use the package version as the source of truth
manifest.version = require('../package.json').version

// Send output to stdout
console.log(manifest)
