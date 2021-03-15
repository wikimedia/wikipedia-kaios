// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = (on, config) => {
  on('before:browser:launch', (browser, launchOptions) => {
    if (browser.name === 'chrome') {
      // fullPage screenshot size is 500 on non-retina screens
      // and 2800x2400 on retina screens
      launchOptions.args.push('--window-size=1000,500')

      // force screen to be non-retina (500 size)
      launchOptions.args.push('--force-device-scale-factor=1')

      // force screen to be retina (2800x2400 size)
      // launchOptions.args.push('--force-device-scale-factor=2')
    }

    if (browser.name === 'electron') {
      // fullPage screenshot size is 500
      launchOptions.preferences.width = 1000
      launchOptions.preferences.height = 500
    }

    if (browser.name === 'firefox') {
      // menubars take up height on the screen
      // so fullPage screenshot size is 1000x1126
      launchOptions.args.push('--width=1000')
      launchOptions.args.push('--height=500')
    }

    return launchOptions
  })
}
