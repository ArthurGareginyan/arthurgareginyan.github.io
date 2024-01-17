// Imports required Gulp plugins and Node.js modules
// for task automation and file manipulation
const
    { src, dest } = require('gulp'),
    babel     = require('gulp-babel'),
    concat    = require('gulp-concat'),
    uglify    = require('gulp-uglify'),

    // Import tasks from my modules
    { path }  = require('./path');

// Bundles and minifies specified JavaScript files,
// transpiles them with Babel, and adds source maps
// based on the environment (development or production)
// Requires: src, dest from gulp, babel, concat, uglify
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
