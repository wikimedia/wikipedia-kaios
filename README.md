[![CircleCI](https://circleci.com/gh/wikimedia/wikipedia-kaios/tree/master.svg?style=svg)](https://circleci.com/gh/wikimedia/wikipedia-kaios/tree/master)

# Wikipedia KaiOS 

The official Wikipedia KaiOS app. [KaiOS](https://developer.kaiostech.com/) is a web-based mobile operating system that enables a new category of smart feature phones, a successor of the discontinued Firefox OS.

KaiOS applications are similar to Progressive Web Apps (PWAs):
* Pure web applications
* Manifest file
* Installed on the device
* Have access to the required APIs for notifications, offline, storage, audio, etc

They are also different:
* Format of the manifest is different
* Size of the icons is specific to KaiOS
* Need to be designed for a small, non-touch screen with a few physical buttons
* Several APIs are specific to the platform (not web standards)
* Running performance on the device

The Wikipedia KaiOS app is built with [Preact](https://preactjs.com/) and we use [Cypress](https://www.cypress.io/) for testing. Tasks and issues are tracked on [Phabricator](https://phabricator.wikimedia.org/project/profile/4305/).

## Installation requirements

* Make sure git is installed: `brew install git`
* Make sure node is installed: `node -v` or `brew install node`
* Make sure npm is installed: `npm -v` or `brew install npm`

## To run this app in your browser

### Clone the app (only the first time)

1. Create a directory for code: `mkdir ~/code && cd ~/code`
2. Download the app source repository: `git clone https://github.com/wikimedia/wikipedia-kaios.git`

### Open the app on your computer
1. Make sure you are in the source directory: `cd wikipedia-kaios`
2. Downloading the latest code: `git pull`
3. Install app dependencies: `npm install`
4. Build the app: `npm run dev`

Now the app is running on your computer at http://127.0.0.1:8080  on your browser

## To run this app on a device

### Clone the app (if you haven't done this alredy)

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

_Steps 2, 3 and 4 need to be redone when you disconnect and reconnect your device or restart your computer._

### Deploy the app to the device
1. Deploy to device, this may take a few minutes: `npm run deploy`

The Wikipedia app should be running on your device now.

## To run the Cypress tests

### Run a test server in one terminal window or tab
`npm run start`

### To run headlessly
`npm test`

### To open cypress and run inside cypress
`npm run cypress`

## To keep app updated with latest version

1. Make sure you are in the source directory: `cd ~/code/wikipedia-kaios`
2. Pull the latest changes: `git pull`
3. Install latest dependencies: `npm install`
4. Rebuild the app: `npm run build`
5. Redeploy the app: `npm run deploy`

---

<p align="center">
    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1122px-Wikipedia-logo-v2.svg.png" width="200" title="wikipedia-logo">
</p>

