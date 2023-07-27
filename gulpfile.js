(() => {

    'use strict';

    const

        // Modules
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

        // Directory locations
        path = {
            source  : './source',
            build   : './docs'
        };

    (async (done) => {
        await del(['**/.DS_Store'], done);
    })();

    function html_optimize () {
        let files = [
            `${path.build}/**/*.html`,
            '!node_modules/**'
        ];
        let posthtml_opts = [
            outlinks({
                excludeHosts : [
                    'arthurgareginyan.com',
                    'www.arthurgareginyan.com'
                ],
                noTarget : [],
                noRel : [
                    'spacexchimp.com',
                    'www.spacexchimp.com',
                    'docs.spacexchimp.com',
                    'demo.spacexchimp.com',
                    'mycyberuniverse.com',
                    'www.mycyberuniverse.com',
                    'milenakiseleva.com'
                ]
            })
        ];
        let htmlmin_opts = {
            html5: true,                         // Parse input according to HTML5 specifications
            preserveLineBreaks: true,            // Always collapse to 1 line break (never remove it entirely) when whitespace between tags include a line break. Must be used in conjunction with collapseWhitespace=true
            collapseWhitespace: true,            // Collapse white space that contributes to text nodes in a document tree
            collapseBooleanAttributes: true,     // Omit attribute values from boolean attributes
            removeComments: true,                // Strip HTML comments
            //removeEmptyElements: true,           // Remove all elements with empty contents
            removeEmptyAttributes: true,         // Remove all attributes with whitespace-only values
            removeScriptTypeAttributes: true,    // Remove type="text/javascript" from script tags. Other type attribute values are left intact
            removeStyleLinkTypeAttributes: true, // Remove type="text/css" from style and link tags. Other type attribute values are left intact
            //minifyJS: true,                      // Minify JavaScript in script elements and event attributes (uses UglifyJS)
            //minifyCSS: true                      // Minify CSS in style elements and style attributes (uses clean-css)
        };
        let beautify_opts = {
            indent_size: 4
        };
        return src(files)
            .pipe(posthtml(posthtml_opts))
            .pipe(htmlmin(htmlmin_opts))
            .pipe(beautify.html(beautify_opts))
            .pipe(dest(`${path.build}/`));
    }

    function html_validate () {
        let files = [
            `${path.build}/**/*.html`,
            '!node_modules/**'
        ];
        return src(files)
            .pipe(htmlhint())
            .pipe(htmlhint.reporter())
            .pipe(htmlhint.failOnError({ suppress: true }));
    }

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
                unprefix(),
                autoprefixer(),
                cssnano(cssnano_opts)
            ]))
            .pipe(dest(`${path.build}/css/`));
    }

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

    function html_prepare_sort_attributes() {
        return through.obj(function(file, enc, cb) {
        const dom = new jsdom.JSDOM(file.contents.toString());
        const document = dom.window.document;

        // Get all elements
        const elements = document.querySelectorAll('*');

        // Loop through each element
        elements.forEach(element => {
            const attributes = Array.from(element.attributes);

            // Sort attributes
            attributes.sort((a, b) => a.name.localeCompare(b.name));

            // Remove all attributes
            attributes.forEach(attr => {
                element.removeAttribute(attr.name);
            });

            // Add back sorted attributes
            attributes.forEach(attr => {
                element.setAttribute(attr.name, attr.value);
            });
        });

        // Set file contents to the new HTML
        file.contents = Buffer.from(dom.serialize());
            cb(null, file);
        });
    }

    function html_prepare_add_new_lines() {
        return src('dist/*.html')
          .pipe(replace('<!DOCTYPE html><html', '<!DOCTYPE html>\n<html'))
          .pipe(replace('><head>', '>\n<head>\n'))
          .pipe(dest('dist'));
    }

    function html_prepare() {
        let files = [
            `${path.build}/**/*.html`,
            '!node_modules/**'
        ];
        return src(files)
            .pipe(html_prepare_sort_attributes())
            .pipe(html_prepare_add_new_lines())
            .pipe(dest(`${path.build}/`));
    }

    exports.html_prepare  = html_prepare;
    exports.html_optimize = html_optimize;
    exports.html_validate = html_validate;
    exports.css     = stylesheets;
    exports.js      = javascript_bundle;
    exports.default = parallel(html_prepare, html_optimize, stylesheets, javascript_bundle);

})();
