#!/bin/bash

TARGET=$1
FILENAME=WikipediaKaiOS$TARGET

rm -rf Wikipedia
rm -rf dist
rm $FILENAME.zip

mkdir Wikipedia

node scripts/manifest.js > Wikipedia/manifest.webapp
LANG_LIST=$TARGET INSTRUMENTATION=1 npm run build
cp -r dist Wikipedia/
cp -r images Wikipedia/
cp index.html Wikipedia/

cd Wikipedia
zip -r ../$FILENAME.zip *
