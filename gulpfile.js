(() => {

    'use strict';

    const

        // Modules
        { src, dest, series, parallel } = require('gulp'),
        del       = require('del'),
        concat    = require('gulp-concat'),
        uglify    = require('gulp-uglify'),
        babel     = require('gulp-babel'),
        htmlmin   = require('gulp-htmlmin'),
        prettify  = require('gulp-html-prettify'),

        // Directory locations
        path = {
            source  : '.',
            build   : '.'
        };

    (async (done) => {
        await del(['**/.DS_Store'], done);
    })();

    function html_optimize () {
        let html_files = [
            `${path.build}/**/*.html`
        ];
        let htmlmin_opts = {
            html5: true,                         // Parse input according to HTML5 specifications
            //preserveLineBreaks: true,            // Always collapse to 1 line break (never remove it entirely) when whitespace between tags include a line break. Must be used in conjunction with collapseWhitespace=true
            //collapseWhitespace: true,            // Collapse white space that contributes to text nodes in a document tree
            collapseBooleanAttributes: true,     // Omit attribute values from boolean attributes
            //removeComments: true,                // Strip HTML comments
            //removeEmptyElements: true,           // Remove all elements with empty contents
            removeEmptyAttributes: true,         // Remove all attributes with whitespace-only values
            removeScriptTypeAttributes: true,    // Remove type="text/javascript" from script tags. Other type attribute values are left intact
            removeStyleLinkTypeAttributes: true, // Remove type="text/css" from style and link tags. Other type attribute values are left intact
            //minifyJS: true,                      // Minify JavaScript in script elements and event attributes (uses UglifyJS)
            //minifyCSS: true                      // Minify CSS in style elements and style attributes (uses clean-css)
        };
        let prettify_opts = {
            indent_char: ' ',
            indent_size: 4
        };
        return src(html_files)
            .pipe(htmlmin(htmlmin_opts))
            .pipe(prettify(prettify_opts))
            .pipe(dest(`${path.build}/`));
    }

    function javascript_bundle () {
        let js_files = [
            `${path.source}/scripts/*`
        ];
        return src(js_files)
            .pipe(babel({
                presets: ['@babel/env']
            }))
            .pipe(concat('scripts.js'))
            .pipe(uglify())
            .pipe(dest(`${path.build}/scripts/`));
    }

    function default_function (done) {

        // Code here

        done();
    }

    exports.html = html_optimize;
    exports.js = javascript_bundle;
    exports.default = default_function;

})();
