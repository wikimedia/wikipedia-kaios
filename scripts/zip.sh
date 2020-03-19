#!/bin/bash

rm -rf Wikipedia
rm -rf dist
rm app.zip

mkdir Wikipedia

node scripts/manifest.js > Wikipedia/manifest.webapp
npm run build
cp -r dist Wikipedia/
cp -r images Wikipedia/
cp index.html Wikipedia/

cd Wikipedia
zip -r ../app.zip *
