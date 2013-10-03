/*jshint node: true */
'use strict';
var Template = require('bem/lib/template');

exports.API_VER = 2;

exports.techMixin = {

    getCreateResult: function(path, suffix, vars) {

        return Template.process([

            'exports.blocks = [',
            '    {',
            '        "name": "b-page"',
            '    }',
            '];'

        ], vars);

    }

};
