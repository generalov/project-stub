/**
 * html-from-priv-js
 * =================
 *
 * Собирает `?.html` по priv-js и данным data.
 *
 * Имя результирующего файла в данный момент не настраивается (нет запросов на эту функцию).
 *
 * **Опции**
 *
 * * *String* **privjsTarget** — Имя `priv.js`-таргета. По умолчанию — `?.priv.js`.
 * * *Object* **data** — Объект с данными, передаваемый в ?.priv.js
 * * *String* **entryPoint** — имя блока в ?.priv.js, по умолчанию 'page'.
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech(require('enb/techs/html-from-priv-js', {data: {}}));
 * ```
 */
/* jslint node:true,strict:true*/
var asyncRequire = require('enb/lib/fs/async-require');


module.exports = require('enb/lib/build-flow').create()
    .name('html-from-priv-js')
    .target('target', '?.html')
    .useSourceFilename('privjsTarget', '_?.priv.js')
    .defineOption('data', {})
    .defineOption('entryPoint', 'page')
    .builder(function(privjsFilename) {
        var data = this._data,
            entryPoint = this._entryPoint;

        delete require.cache[privjsFilename];
        return asyncRequire(privjsFilename).then(function (privjs) {
            var iGlobal = (
                    privjs['i-global'] ||
                    function () {return {params: {}};}
                ).apply(data);

            if (iGlobal.params.lang && BEM) {
                BEM.I18N.lang(iGlobal.params.lang);
            }

            var bPage = privjs.blocks[entryPoint].apply(data);
            var bemjson = [iGlobal, bPage];
            return privjs.BEMHTML.apply(bemjson);
        });
    })
    .createTech();
