/*jslint node:true*/
var BEM = require('bem'),
    Q = BEM.require('qq'),
    PATH = require('path'),
    environ = require('bem-environ'),
    I18NJSJS = require(environ.getLibPath('bem-bl', 'blocks-common/i-bem/bem/techs/v2/i18n.js.js'));


exports.baseTechName = 'stas.js';

exports.techMixin = BEM.util.extend({}, I18NJSJS.techMixin, {

    getBaseTechSuffix: function() {
        return 'stas.js';
    },

    getBuildSuffixes: function() {
        return [this.getBaseTechSuffix()];
    },

    getBuildResults: function(prefixes, outputDir, outputName) {

        var res = {};
        res[this.getBaseTechSuffix()] = this.getBuildResult(prefixes, this.getBaseTechSuffix(), outputDir, outputName);
        return Q.shallow(res);

    },

    getBuildResult: function(prefixes, suffix, outputDir, outputName) {

        var _this = this,
            prefix = PATH.resolve(outputDir, outputName),
            source = this.getPath(prefix, this.getSourceSuffix());

        return Q.all([
                this.__base(prefixes, suffix, outputDir, outputName),
                BEM.util.readJsonJs(source)
            ])
            .spread(function(res, data) {

                var i18n = ['all'].concat(_this.getLangs())
                    .map(function(lang) {
                        return data[lang]? _this.serializeI18nData(data[lang], lang).join('\n') : '';
                    });

                return res.concat(i18n, [_this.serializeI18nInit(_this.getDefaultLang())]);

            });

    },

    storeBuildResult: function(path, suffix, res) {
        return BEM.util.writeFile(path, res);
    },

    getDependencies: function() {
        // return ['i18n', 'bemhtml'];
        return ['i18n'].concat(this.__base());
    }

});
