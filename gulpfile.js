(() => {

    // Enforces strict mode to catch common coding mistakes
    // and prevent the use of certain features
    'use strict';

    // Imports required Gulp plugins and Node.js modules
    // for task automation and file manipulation
    const
        { src, dest, series, parallel } = require('gulp'),
        del       = require('del'),
        concat    = require('gulp-concat'),
        uglify    = require('gulp-uglify'),
        posthtml  = require('gulp-posthtml'),
        postcss   = require('gulp-postcss'),
        babel     = require('gulp-babel'),
        unprefix  = require('postcss-unprefix'),
        autoprefixer = require('autoprefixer'),
        cssnano   = require('cssnano'),
        htmlmin   = require('gulp-htmlmin'),
        beautify  = require('gulp-beautify'),
        htmlhint  = require('gulp-htmlhint'),
        outlinks  = require('posthtml-outlinks'),
        through   = require('through2'),
        jsdom     = require('jsdom'),
        replace   = require('gulp-replace'),

        // Defines directory paths for the source, preview,
        // and build environments
        { path }  = require('./gulp-tasks/path');

    // Immediately invoked asynchronous function
    // that deletes all .DS_Store files in the project
    // Requires: del
    (async (done) => {
        await del(['**/.DS_Store'], done);
    })();

    // Import all tasks from the htmlTasks module
    const {
        html_prepare_sort_attributes,
        html_optimize,
        html_validate
    } = require('./gulp-tasks/html');

    // Import all tasks from the stylesheetTasks module
    const {
        stylesheet_bundle
    } = require('./gulp-tasks/stylesheet');

    // Import all tasks from the javascriptTasks module
    const {
        javascript_bundle
    } = require('./gulp-tasks/javascript');

    // Defines the Gulp tasks that can be executed from the command line,
    // specifying their dependencies and execution order
    exports.html_optimize = html_optimize;
    exports.html_validate = html_validate;
    exports.css     = stylesheets;
    exports.js      = javascript_bundle;
    exports.default = parallel(html_optimize, stylesheets, javascript_bundle);

})();
