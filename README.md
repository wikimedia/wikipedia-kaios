[![CircleCI](https://circleci.com/gh/wikimedia/wikipedia-kaios/tree/master.svg?style=svg)](https://circleci.com/gh/wikimedia/wikipedia-kaios/tree/master)

# Wikipedia KaiOS 

The official Wikipedia KaiOS app. [KaiOS](https://developer.kaiostech.com/) is a web-based mobile operating system that enables a new category of smart feature phones, a successor of the discontinued Firefox OS.

The Wikipedia KaiOS app is built with [Preact](https://github.com/preactjs/preact), we use [Cypress](https://github.com/cypress-io/cypress) for testing, and [Translatewiki](https://github.com/wikimedia/translatewiki) for translations. Tasks and issues are tracked on [Phabricator](https://phabricator.wikimedia.org/project/profile/4305/).

## Installation requirements (for macOS)

* Make sure git is installed: `brew install git`
* Make sure node is installed: `node -v` or `brew install node`
* Make sure npm is installed: `npm -v` or `brew install npm`
* Make sure the [Firefox browser is installed](https://www.mozilla.org/en-US/firefox/new/)

## To run this app in Firefox

### Clone the repository (only the first time)

1. Create a directory for code: `mkdir ~/code && cd ~/code`
2. Download the app source repository: `git clone https://github.com/wikimedia/wikipedia-kaios.git`

### Open the app on your computer
1. Make sure you are in the source directory: `cd wikipedia-kaios`
2. Downloading the latest code: `git pull`
3. Install app dependencies: `npm install`
4. Build the app: `npm run dev`

Now the app is running on your computer at http://127.0.0.1:8080  in Firefox. You can open the [Firefox Developer Tools](https://developer.mozilla.org/en-US/docs/Tools) and use the [Responsive Design Mode](https://developer.mozilla.org/en-US/docs/Tools/Responsive_Design_Mode) to interact with the app in a more appropiate setting.

## To run this app on a device

### Clone the repository (if you haven't done this alredy)

1. Create a directory for code: `mkdir ~/code && cd ~/code`
2. Download the app source repository: `git clone https://github.com/wikimedia/wikipedia-kaios.git`
3. Go to the app source: `cd wikipedia-kaios`

### Build the app
1. Install app dependencies: `npm install`
2. Build the app: `npm run build`

### Connect your device
1. Connect your device to your computer using a USB cable
2. Enable debug mode on the device by typing: `*#*#33284#*#*`
3. Check that adb is running and sees your device: `adb devices`

### Deploy the app to the device
1. Deploy to device, this will take a few minutes: `npm run deploy`

The Wikipedia app should be running on your device now.

## To run the Cypress tests

### Run a test server in one terminal window or tab
`npm run start`

### To run headlessly
`npm test`

### To open cypress and run inside cypress
`npm run cypress:open`

## To keep app updated with latest version

1. Make sure you are in the source directory: `cd ~/code/wikipedia-kaios`
2. Pull the latest changes: `git pull`
3. Install latest dependencies: `npm install`
4. Rebuild the app: `npm run build`
5. Redeploy the app: `npm run deploy`
