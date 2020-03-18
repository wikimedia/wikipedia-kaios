#!/bin/bash

# Reset build dir
rm -rf build
mkdir build

rm -rf dist

node scripts/manifest.js > build/manifest.webapp
npm run build
cp -r dist build/
cp -r images build/
cp index.html build/

zip -r app.zip build
