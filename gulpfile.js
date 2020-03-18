(() => {

    'use strict';

    const

        // Modules
        { parallel } = require('gulp'),
        del = require('del'),

        // Directory locations
        path = {
            source  : './',
            build   : './'
        };

    (async (done) => {
        await del(['**/.DS_Store'], done);
    })();

    function default_function (done) {

        // Code here

        done();
    }

    exports.default = default_function;

})();
