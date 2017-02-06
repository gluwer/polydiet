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
    // Okay, so first thing we do is clear the build directory
    console.log(`Deleting ${buildDirectory} directory...`);
    del([buildDirectory])
      .then(() => {
        // Okay, now lets get your source files
        let sourcesStream = polymerProject.sources()
          // Oh, well do you want to minify stuff? Go for it!
          // Here's how splitHtml & gulpif work
          .pipe(polymerProject.splitHtml())
          .pipe(gulpif(/\.js$/, uglify()))
          .pipe(gulpif(/\.css$/, cssSlam()))
          .pipe(gulpif(/\.html$/, htmlMinifier(htmlMinifierConf)))
          .pipe(gulpif(/\.(png|gif|jpg|svg)$/, imagemin()))
          .pipe(polymerProject.rejoinHtml());

        // Okay, now lets do the same to your dependencies
        let dependenciesStream = polymerProject.dependencies()
          .pipe(polymerProject.splitHtml())
          .pipe(gulpif(/\.js$/, uglify()))
          .pipe(gulpif(/\.css$/, cssSlam()))
          .pipe(gulpif(/\.html$/, htmlMinifier(htmlMinifierConf)))
          .pipe(polymerProject.rejoinHtml());

        // Okay, now lets merge them into a single build stream
        let buildStream = mergeStream(sourcesStream, dependenciesStream)
          .once('data', () => {
            console.log('Analyzing build dependencies...');
          });

        // If you want bundling, pass the stream to polymerProject.bundler.
        // This will bundle dependencies into your fragments so you can lazy
        // load them.
        buildStream = buildStream.pipe(polymerProject.bundler);

        // Okay, time to pipe to the build directory
        buildStream = buildStream.pipe(gulp.dest(buildDirectory));

        // waitFor the buildStream to complete
        return waitFor(buildStream);
      })
      .then(() => {
        // Okay, now lets generate the Service Worker
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
    `${buildDirectory}/bower_components/vaadin-grid/img/**/*`,
    `${buildDirectory}/src/glu-polydiet.html`,
    `${buildDirectory}/data/foods.json`
  ], {base: buildDirectory}).pipe(gulp.dest(ghPagesDirectory));
}));