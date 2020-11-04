#!/bin/bash

TARGET=$1
FILENAME=WikipediaKaiOS$TARGET

rm -rf Wikipedia
rm -rf dist
rm $FILENAME.zip

mkdir Wikipedia

TARGET_STORE=$TARGET node scripts/manifest.js > Wikipedia/manifest.webapp
TARGET_STORE=$TARGET INSTRUMENTATION=1 npm run build
cp -r dist Wikipedia/
cp -r images Wikipedia/
cp index.html Wikipedia/

cd Wikipedia
zip -r ../$FILENAME.zip *
