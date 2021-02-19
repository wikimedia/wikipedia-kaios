#!/bin/bash

rm -rf gh-pages
mkdir gh-pages

DISABLE_REQUEST_HEADER=1 INSTRUMENTATION=0 npm run build
cp -r dist gh-pages/dist
cp -r images gh-pages/images
cp index.html gh-pages/
cp sim.html gh-pages/
touch gh-pages/.nojekyll
