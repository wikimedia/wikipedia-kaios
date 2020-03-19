#!/bin/bash

rm -rf Wikipedia
mkdir Wikipedia

rm -rf dist

node scripts/manifest.js > Wikipedia/manifest.webapp
npm run build
cp -r dist Wikipedia/
cp -r images Wikipedia/
cp index.html Wikipedia/

zip -r app.zip Wikipedia
