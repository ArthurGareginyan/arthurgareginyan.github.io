// Imports required Gulp plugins and Node.js modules
// for task automation and file manipulation
const
    { src, dest } = require('gulp'),
    postcss   = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano   = require('cssnano'),
    //unprefix  = require('postcss-unprefix'),

    // Import tasks from my modules
    { path }  = require('./path');

// Bundles and optimizes CSS files, adding vendor prefixes and source maps
// based on the environment (development or production)
// Requires: src, dest from gulp, postcss, autoprefixer, cssnano
function stylesheets () {
    let css_files = [
        `${path.build}/css/*.css`
    ];
    let cssnano_opts = {
        preset: ['default', {
            discardComments: {
                removeAll: true,
            },
        }]
    };
    return src(css_files)
        .pipe(postcss([
            //unprefix(),
            autoprefixer(),
            cssnano(cssnano_opts)
        ]))
        .pipe(dest(`${path.build}/css/`));
}

// ... Any other shared variables or functions

// Export the function so it can be used in other files
module.exports = {
    stylesheets
    // ... Export other shared variables or functions
};
