#!/usr/bin/env sh

set -e

rm -rf dist || true
npm run build
cd dist

git init -b main
git add -A
git commit -m 'Build deployed'
git push -f git@github.com:andrew-markin/spark.git main:gh-pages

cd -
rm -rf dist || true
