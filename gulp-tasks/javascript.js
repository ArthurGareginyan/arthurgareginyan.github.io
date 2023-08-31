// Imports required Gulp plugins and Node.js modules
// for task automation and file manipulation
const
    { src, dest } = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    babel     = require('gulp-babel'),
    concat    = require('gulp-concat'),
    uglify    = require('gulp-uglify'),
    gulpif    = require('gulp-if'),

    // Import tasks from my modules
    { path }  = require('./path'),
    { env }   = require('./environment');

// Bundles and minifies specified JavaScript files,
// transpiles them with Babel, and adds source maps
// based on the environment (development or production)
// Requires: src, dest from gulp, sourcemaps.init, babel, concat, uglify, gulpif
function javascript_bundle () {
    let js_files = [
        `${path.source}/scripts/*.js`,
        `!${path.source}/scripts/scripts.js`
    ];
    return src(js_files)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(dest(`${path.build}/scripts/`));
}

// ... Any other shared variables or functions

// Export the function so it can be used in other files
module.exports = {
    javascript_bundle
    // ... Export other shared variables or functions
};
