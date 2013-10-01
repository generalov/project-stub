/*jshint node: true*/
'use strict';
var environ = require('bem-environ');

exports.baseTechName = environ.getLibPath('bem-bl', 'blocks-common/i-bem/bem/techs/v2/html.js');

exports.API_VER = 2;

exports.techMixin = {

    getBaseTechSuffix: function() {
        return 'html';
    },

    getBuildSuffixesMap: function() {
        var map = {};

        map[this.getBaseTechSuffix()] = [this.getBaseTechSuffix()];

        return map;
    },

    getBemjson: function(prefix) {

        var path = this.getPath(prefix, 'stas.js'),
            bundle = this.context.opts.block[0],
            bemjson = { block: 'b-page', content: 'stas.js' },
            blocks;

        delete require.cache[require.resolve(path)];

        blocks = require(path);
        if (blocks && blocks['b-page']) {
            var data = {
                bundle: bundle
            };
            bemjson = blocks['b-page'].apply(data);
        }
        return bemjson;
    },

    getDependencies: function () {
        return ['bemhtml', 'stas.js'];
    }

};
