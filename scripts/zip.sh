#!/bin/bash

TARGET=$1
FILENAME=WikipediaKaiOS$TARGET

rm -rf Wikipedia
rm -rf dist
rm $FILENAME.zip

mkdir Wikipedia

TARGET_STORE=$TARGET node scripts/manifest.js > Wikipedia/manifest.webapp
TARGET_STORE=$TARGET INSTRUMENTATION=1 MANIFEST_FILE=./Wikipedia/manifest.webapp npm run build
cp dist/main.js Wikipedia/
cp -r images Wikipedia/
cp index.html Wikipedia/

cd Wikipedia
zip -r ../$FILENAME.zip *
