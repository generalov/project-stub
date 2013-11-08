/**
 * borschik-links-json
 * ===================
 *
 * Собирает *json-links*-файлы по deps'ам инклудами, сохраняет в виде `_?.links.json`.
 * Может пригодиться в паре с borschik для использования в js-скриптах динамических урлов.
 *
 * **Опции**
 *
 * * *String* **target** — Результирующий таргет. По умолчанию `_?.links.json`.
 * * *String* **sourceSuffixes** — Суффиксы файлов для сборки. По умолчанию `links.json`.
 * * *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
 *   (его предоставляет технология `files`). По умолчанию — `?.files`.
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech(require('enb/techs/borschik-links-json'));
 * ```
 */
/* jslint node:true,strict:true */

var Vow = require('vow'),
    vowFs = require('enb/lib/fs/async-fs'),
    BorschikPreprocessor = require('enb/lib/preprocess/borschik-preprocessor');

module.exports = require('enb/lib/build-flow').create()
    .name('borschik-links-json')
    .target('target', '_?.links.json')
    .useFileList('links.json')
    .builder(function(linksJsonFiles) {
        var _this = this,
            target = this._target,
            jsBorschikPreprocessor = new BorschikPreprocessor(),
            freeze = true,
            minify = true;

        return Vow.all(linksJsonFiles.map(function(file) {
            return _this.node.createTmpFileForTarget(target).then(function(tmpfile) {
                return jsBorschikPreprocessor.preprocessFile(file.fullname, tmpfile, freeze, minify, 'json').then(function() {
                    return vowFs.read(tmpfile, 'utf8').then(function(data) {
                        vowFs.remove(tmpfile);
                        return data;
                    });
                });
            });
        })).then(function(res) {
            // console.log(res)
            var parsed = res.map(JSON.parse, res),
                mergedObj = extend.apply(this, [{}].concat(parsed));
            return JSON.stringify(mergedObj);
        });
    })
    .createTech();

function extend (obj) {
    for (var i = 1, c = arguments.length; i < c; i++) {
        var source = arguments[i];
        // console.log(source)
        if (source) {
            for (var prop in source) {
                obj[prop] = source[prop];
            }
        }
    }
    return obj;
}