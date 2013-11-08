/**
 * priv-js
 * =======
 *
 * Собирает `?.priv.js` по deps'ам, подготавливая для сборки борщиком, добавляет BEMHTML в начало.
 *
 * Имя результирующего файла в данный момент не настраивается (нет запросов на эту функцию).
 *
 * **Опции**
 *
 * * *String* **bemhtmlTarget** — Имя `bemhtml.js`-таргета. По умолчанию — `?.bemhtml.js`.
 * * *String* **sourceFiles** — files-таргет, на основе которого получается список исходных файлов
 *   (его предоставляет технология `files`). По умолчанию — `?.files`.
 * * *String* **freezeableTechs** — дополнительный список файлов, после которых должна собираться технология.
 *                                  По умолчанию []. Для продакшена может быть что-то типа ['_?.css', '_?.js']
 * * *String* **borschikLinkJson** — файл links-json борщика, подключаемый в priv.js. По умолчанию `_?.links.json`.
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech(require('enb/techs/priv-js'));
 * ```
 */
/* jslint node:true,strict:true */

module.exports = require('enb/lib/build-flow').create()
    .name('priv-js')
    .target('target', '?.priv.js')
    .useFileList('priv.js')
    .useSourceText('bemhtmlTarget', '?.bemhtml.js')
    .useSourceListFilenames('freezeableTechs', [])
    .useSourceFilename('borschikLinkJson', '_?.links.json')
    .builder(function(sourceFiles, bemhtml, freezeableTechs) {
        var _this = this,
            linksJsonPath = this._borschikLinkJson;
        return [
            '/* borschik magic */',
            'var borschik = exports.borschik = {',
            '    links: {},',
            '    addLinks: function(json) {',
            '        for (var link in json) {',
            '            this.links[link] = json[link];',
            '        }',
            '    },',
            '    link: function(link) {',
            '        // link with "@" is dynamic',
            '        if (link.charAt(0) === \'@\') {',
            '            return this.links[link.substr(1)];',
            '        }',
            '        return link;',
            '    }',
            '};',
            '',
            'borschik.addLinks(/* borschik:include:' + linksJsonPath + ' */);',
            'borschik.addLinks({',
                freezeableTechs.map(function(fileName){
                    var path = _this.node.relativePath(fileName).replace(/^\.\//, '');
                    return [
                        JSON.stringify(path),
                        'borschik.link(' + JSON.stringify(path) + ')'
                    ].join(': ');
                }).join(',\n'),
            '});',
            '',
            '/* '+this._bemhtmlTarget+' */',
            bemhtml,
            '',
            '/* priv.js blocks definitions */',
            'var blocks = {};',
        ].concat(
            sourceFiles.map(function(file) {
                return '/*borschik:include:' + _this.node.relativePath(file.fullname) + '*/;';
            })
        ).concat([
            '',
            'if (typeof exports !== "undefined" && typeof blocks !== "undefined") { exports.blocks = blocks; }',
        ])
        .join('\n');
    })
    .createTech();
