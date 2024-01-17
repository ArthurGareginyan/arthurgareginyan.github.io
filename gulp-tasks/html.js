// Imports required Gulp plugins and Node.js modules
// for task automation and file manipulation
const
    { src, dest } = require('gulp'),
    posthtml  = require('gulp-posthtml'),
    htmlmin   = require('gulp-htmlmin'),
    htmlhint  = require('gulp-htmlhint'),
    beautify  = require('gulp-beautify'),
    outlinks  = require('posthtml-outlinks'),

    // Import tasks from my modules
    { path }  = require('./path');

//
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

// Optimizes HTML files by applying various transformations
// such as link exclusion, minification, and beautification
// Requires: src, dest from gulp, posthtml, htmlmin, beautify, outlinks
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
        .pipe(html_prepare_sort_attributes())
        .pipe(replace('<!DOCTYPE html><html', '<!DOCTYPE html>\n<html'))
        .pipe(replace('><head>', '>\n<head>\n'))
        .pipe(dest(`${path.build}/`));
}

// Validates HTML files in the build directory
// and fails the task if any errors are found
// Requires: src from gulp, htmlhint
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

// ... Any other shared variables or functions

// Export the function so it can be used in other files
module.exports = {
    html_prepare_sort_attributes,
    html_optimize,
    html_validate
    // ... Export other shared variables or functions
};
