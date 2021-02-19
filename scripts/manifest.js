
const fs = require('fs')

let manifest = JSON.parse(fs.readFileSync('manifest.webapp'))

const jioLocales = [
	'en-US',
	'hi-IN',
	'as-IN',
	'bn-IN',
	'gu-IN',
	'kn-IN',
	'ks-IN',
	'ml-IN',
	'mr-IN',
	'ne-IN',
	'or-IN',
	'pa-IN',
	'sa-IN',
	'sd-IN', // RTL
	'ta-IN',
	'te-IN',
	'und-bod',
	'mai-IN',
	'kok-IN',
	'mni-IN',
	'doi-IN',
	'ur-IN', // RTL
]

const kaiLocales = [
	"af-ZA",
	"ar-SA", // RTL
	"az-Latn-AZ",
	"be-BY",
	"bg-BG",
	"bn-IN",
	"bn-BD",
	"bs-BA",
	"cs-CZ",
	"da-DK",
	"de-DE",
	"el-GR",
	"en-GB",
	"en-US",
	"es-US",
	"et-EE",
	"es-ES",
	"fa-IR",
	"fi-FI",
	"fil-PH",
	"fr-CA",
	"fr-FR",
	"he-IL", // RTL
	"hi-HI",
	"hr-HR",
	"hu-HU",
	"hy-AM",
	"id-ID",
	"is-IS",
	"it-IT",
	"it-LT",
	"ka-GE",
	"kk-KZ",
	"km-KH",
	"lo-LA",
	"lv-LV",
	"mk-MK",
	"mo-RO",
	"ms-MY",
	"nb-NO",
	"ne-IN",
	"nl-NL",
	"pl-PL",
	"ps-AF",
	"pt-BR",
	"pt-PT",
	"ro-RO",
	"ru-RU",
	"si-LK",
	"sk-SK",
	"sl-SI",
	"sq-AL",
	["sr-Latn-CS", 'sr-el'],
	"sv-SE",
	"sw-ZA",
	"ta-IN",
	"th-TH",
	"tr-TR",
	"uk-UA",
	"ur-PK", // RTL
	"uz-Cyrl-UZ",
	"vi-VN",
	"xh-ZA",
	["zh-CN", 'zh-hans'],
	["zh-HK", 'zh-hant'],
	["zh-TW", 'zh-hant'],
	"zu-ZA",
	"as-IN",
	"und-bod",
	"doi-IN",
	"gu-IN",
	"kn-IN",
	"ks-IN",
	"kok-IN",
	"mai-IN",
	"ml-IN",
	"mni-IN",
	"mr-IN",
	"or-IN",
	"pa-IN",
	"sa-IN",
	"sat-IN",
	"sd-IN",
	"te-IN",
	"ko-KR"
]

// Build an object with all translations available in i18n/*.json
const translations = {}
fs.readdirSync('./i18n').forEach(file => {
	if (file === 'qqq.json') {
		return
	}
	const lang = file.substr(0, file.indexOf('.'))
	const messages = require('../i18n/' + file)

	if (messages['app-title']) {
		translations[lang.toLowerCase()] = {
			name: messages['app-title'],
			subtitle: messages['app-subtitle'],
			description: messages['app-description']
		}
	}
});

// Go through the locales supported by KaiOS and Jio
// and try to find appropriate translations
const allLocales = [...new Set([...jioLocales, ...kaiLocales])]
allLocales.sort()
manifest.locales = {}
allLocales.forEach(locale => {
	const [manifestCode, translationCode] = Array.isArray(locale) ?
		locale : [ locale, locale ]

	const translation = translations[translationCode.toLowerCase()] ||
		translations[translationCode.substr(0, translationCode.indexOf('-'))]

	if (translation) {
		manifest.locales[manifestCode] = translation
	} else {
		console.warn('Missing app information translation for', manifestCode)
	}
})

// Set english messages at the top level
manifest.name = translations['en'].name
manifest.display = translations['en'].name
manifest.subtitle = translations['en'].subtitle
manifest.description = translations['en'].description

manifest.version = require('../package.json').version
// The JioStore requires a 4-digit version (a.b.c.d) so we add
// a non-significant 0 to it.
if (process.env.TARGET_STORE === 'jio') {
	manifest.version += '.0'
}

// Send output to stdout
console.log(JSON.stringify(manifest, null, 2))
