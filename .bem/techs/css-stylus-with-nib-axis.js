/**
 * css-stylus-with-nib-axis
 * ===================
 *
 * Собирает *css*-файлы вместе со *styl*-файлами по deps'ам, обрабатывает инклуды и ссылки, сохраняет в виде `?.css`.
 * При сборке *styl*-файлов использует `nib` и `axis`.
 *
 * **Опции**
 *
 * * *String* **target** — Результирующий таргет. По умолчанию `?.css`.
 * * *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
 *   (его предоставляет технология `files`). По умолчанию — `?.files`.
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech(require('css-stylus-with-nib-axis'));
 * ```
 */

module.exports = require('enb/techs/css-stylus').buildFlow()
    .name('css-stylus-with-nib-axis')
    .methods({
        _configureRenderer: function(renderer) {
            var axis, nib;
            try {
                axis = require('axis-css');
            } catch (e) {
                throw new Error(
                    'The technology "css-stylus-with-nib-axis" cannot be executed ' +
                    'because the npm module "axis-css" was not found.'
                );
            }

            try {
                nib = require('nib');
            } catch (e) {
                throw new Error(
                    'The technology "css-stylus-with-nib-axis" cannot be executed ' +
                    'because the npm module "nib" was not found.'
                );
            }

            renderer.use(nib());
            renderer.use(axis());
            return renderer;
        }
    })
    .createTech();
