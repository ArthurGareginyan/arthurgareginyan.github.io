(() => {

    'use strict';

    const

        // Modules
        { src, dest, series, parallel } = require('gulp'),
        del = require('del'),
        concat    = require('gulp-concat'),
        uglify    = require('gulp-uglify'),
        babel     = require('gulp-babel'),

        // Directory locations
        path = {
            source  : '.',
            build   : '.'
        };

    (async (done) => {
        await del(['**/.DS_Store'], done);
    })();

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

    exports.js = javascript_bundle;
    exports.default = default_function;

})();
