/* eslint-env node,es6 */
/* eslint no-console: "off" */
/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

'use strict';

//require('plylog').setVerbose();

const del = require('del');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const cssSlam = require('css-slam').gulp;
const htmlMinifier = require('gulp-html-minifier');
const mergeStream = require('merge-stream');
const polymerBuild = require('polymer-build');
const HtmlSplitter = polymerBuild.HtmlSplitter;

const swPrecacheConfig = require('./sw-precache-config.js');
const polymerJson = require('./polymer.json');
const polymerProject = new polymerBuild.PolymerProject(polymerJson);
const buildDirectory = 'build';
const ghPagesDirectory = 'gh-pages';

const htmlMinifierConf = {
  collapseWhitespace: true,
  conservativeCollapse: true,
  removeComments: true
};

/**
 * Waits for the given ReadableStream
 */
function waitFor(stream) {
  return new Promise((resolve, reject) => {
    stream.on('end', resolve);
    stream.on('error', reject);
  });
}

function build() {
  return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
    console.log(`Deleting ${buildDirectory} directory...`);
    del([buildDirectory])
      .then(() => {
        const sourcesHtmlSplitter = new HtmlSplitter();

        let sourcesStream = polymerProject.sources()
          .pipe(sourcesHtmlSplitter.split())
          .pipe(gulpif(/\.(png|gif|jpg|svg)$/, imagemin()))
          .pipe(sourcesHtmlSplitter.rejoin());

        let dependenciesStream = polymerProject.dependencies()

        let buildStream = mergeStream(sourcesStream, dependenciesStream)
          .once('data', () => {
            console.log('Analyzing build dependencies...');
          });
        
        const buildHtmlSplitter = new HtmlSplitter();
        buildStream = buildStream.pipe(polymerProject.bundler)
          .pipe(buildHtmlSplitter.split())
          .pipe(gulpif(/\.js$/, uglify()))
          .pipe(gulpif(/\.css$/, cssSlam()))
          .pipe(gulpif(/\.html$/, htmlMinifier(htmlMinifierConf)))
          .pipe(buildHtmlSplitter.rejoin());

        buildStream = buildStream.pipe(gulp.dest(buildDirectory));

        return waitFor(buildStream);
      })
      .then(() => {
        console.log('Generating the Service Worker...');
        return polymerBuild.addServiceWorker({
          project: polymerProject,
          buildRoot: buildDirectory,
          path: 'sw.js',
          bundled: true,
          swPrecacheConfig: swPrecacheConfig
        });
      })
      .then(() => {
        // You did it!
        console.log('Build complete!');
        resolve();
      });
  });
}

gulp.task('build', build);

gulp.task('gh-pages-clean', () => {
  return del([
    `${ghPagesDirectory}/**/*`,
    `!${ghPagesDirectory}/.git{,/**}`
  ]);
});

gulp.task('gh-pages-build', gulp.series(gulp.parallel(['build', 'gh-pages-clean']), () => {
  return gulp.src([
    `${buildDirectory}/images/**/*`,
    `${buildDirectory}/index.html`,
    `${buildDirectory}/sw.js`,
    `${buildDirectory}/manifest.json`,
    `${buildDirectory}/bower_components/webcomponentsjs/webcomponents-lite.min.js`,
    `${buildDirectory}/src/glu-polydiet.html`,
    `${buildDirectory}/data/foods.json`
  ], {base: buildDirectory}).pipe(gulp.dest(ghPagesDirectory));
}));