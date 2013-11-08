/*jslint node:true,strict:true*/
var fs = require('fs'),
    path = require('path');

module.exports = function(config) {

    var levels = [
            {path: 'libs/bem-core/common.blocks', check: false},
            {path: 'common.blocks', check: true},
        ].map(function(levelPath) { return config.resolvePath(levelPath); });

    var libraries = {
            'libs/bem-core' : {
                type: 'git',
                url: 'git://github.com/bem/bem-core.git',
                treeish: 'v1'
            },
            // 'libs/bem-components-v1' : {
            //     type: 'git',
            //     url: 'git://github.com/bem/bem-components.git',
            //     treeish: 'v1'
            // },
        };

    // Установка переменных среды для shell-команд.
    config.setEnv({
    // FIXME: перменные окружения из config.setEnv() передаются только в shell-таски
    //        борщик запускается технологией как-то иначе. пока втыкаю в process.env.
    //     'BORSCHIK_FREEZABLE_EXTS': 'jpg jpeg gif ico png swf svg ttf eot otf woff htc css js', // +htc css js
    });
    process.env.BORSCHIK_FREEZABLE_EXTS = 'jpg jpeg gif ico png swf svg ttf eot otf woff htc css js'; // +htc css js

    config.nodes('desktop.bundles/*');

    config.nodeMask(/desktop\.bundles\/.*/, function(nodeConfig) {
        /* merged bundle: _common.priv.js и статику в freezePath */
        if (nodeConfig.getPath().match(/common$/)) {
            var techs = [
                    [ require('enb/techs/levels'), { levels: levels } ],
                    require('enb/techs/files'),
                    /* css */
                    require('enb/techs/css-includes'),
                    [ require('enb/techs/borschik'), { freeze: true, minify: true, sourceTarget: '?.css', destTarget: '_?.css' } ],
                    /* js */
                    [ require('enb/techs/browser-js'), {target:'?.pre.js'}],
                    [ require('enb-modules/techs/prepend-modules'), {source: '?.pre.js'}],
                    [ require('enb/techs/borschik'), { freeze: true, minify: true, sourceTarget: '?.js', destTarget: '_?.js' } ],
                    /* borschik-links-json */
                    [ require('./enb/techs/borschik-links-json') ],
                    /* bemhtml */
                    require('enb-bemxjst/techs/bemhtml'),
                    /* priv.js */
                    [ require('./enb/techs/priv-js'), { freezeableTechs: ['_?.css', '_?.js'] } ],
                    [ require('enb/techs/borschik'), { freeze: true, minify: false, sourceTarget: '?.priv.js', destTarget: '_?.priv.js' } ],
                ],
                pageNodes;

            // Проходимся по существующим страницам
            pageNodes = fs.readdirSync('desktop.bundles')
                .filter(function (path) { return 'desktop.bundles/' + path !== nodeConfig.getPath(); })
                .map(function (page) { return {nodePath: 'desktop.bundles/' + page, baseName: page}; });

            techs.push.apply(techs, pageNodes.map(function(pageNode){
                return [ require('enb/techs/deps-provider'), {
                    sourceNodePath: pageNode.nodePath,
                    depsTarget: pageNode.baseName + '.deps.js'
                } ];

            }));

            techs.push([ require('enb/techs/deps-merge'), {
                depsSources: pageNodes.map(function(pageNode){ return pageNode.baseName + '.deps.js'; })
            }]);

            nodeConfig.addTechs(techs);

            // css, js как конечные технологии здесь нас не интересуют
            // они собираются промежуточными технологиями, затем ссылки на них замораживаются
            // поэтому ссылки в priv.js ведут на статику в freezePath
            nodeConfig.addTargets(['_?.priv.js']);
        /* другие страницы */
        } else {
            nodeConfig.addTechs([
                [ require('enb/techs/file-provider'), { target: '?.bemjson.js' } ],
                require('enb/techs/bemdecl-from-bemjson'),
                [ require('enb/techs/levels'), { levels: levels } ],
                require('enb/techs/deps-old'),
                require('enb/techs/files'),
                /* bemhtml */
                require('enb-bemxjst/techs/bemhtml'),
                /* js */
                [ require('enb/techs/browser-js'), {target:'?.pre.js'}],
                [ require('enb-modules/techs/prepend-modules'), {source: '?.pre.js'}],
                [ require('enb/techs/file-copy'), { sourceTarget: '?.js', destTarget: '_?.js' } ],
                /* css */
                require('enb/techs/css-includes'),
                [ require('enb/techs/file-copy'), { sourceTarget: '?.css', destTarget: '_?.css' } ],
                /* html */
                require('enb/techs/html-from-bemjson'),
            ]);
            nodeConfig.addTargets(['_?.js', '_?.css', '?.html']);
        }
    });


    config.mode('development', function() {
        symlink('development', 'configs/current');
    });

    config.mode('production', function() {
        symlink('production', 'configs/current');
        /* cleanup freeze path */
        // FIXME: удалять только когда enb make запускается с --no-cache.
        // иначе технологии не ребилдятся и фриз не создается
        // rmdir(getFreezePath('./'));
    });

    /* external libraries */
    config.includeConfig('enb-checkout');
    config.module('enb-checkout', function(config) { config.addLibraries(libraries); });
    config.task('libraries.get', function(task) { return config.module('enb-checkout').checkoutLibraries(task); });

    function symlink(from, to) {
        var exists = fs.existsSync(to);
        if (exists && fs.readlinkSync(to) !== from) {
            fs.unlinkSync(to);
            exists = false;
        }
        if (!exists) {
            fs.symlinkSync(from, to);
        }
    }

    function rmdir (dir) {
        var list = fs.readdirSync(dir);
        for(var i = 0; i < list.length; i++) {
            var filename = path.join(dir, list[i]);
            var stat = fs.statSync(filename);
            if(stat.isDirectory()) {
                rmdir(filename);
            } else {
                fs.unlinkSync(filename);
            }
        }
        fs.rmdirSync(dir);
    }

    function getFreezePath(path) {
        var borschikConfig = (JSON.parse(fs.readFileSync('.borschik', 'utf-8'))['freezePaths'] || {})
        return borschikConfig[path];
    }
};
