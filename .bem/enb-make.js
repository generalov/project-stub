module.exports = function(config) {

    config.nodes('desktop.bundles/*');

    config.nodeMask(/desktop\.bundles\/.*/, function(nodeConfig) {
        nodeConfig.addTechs([
            [ require('enb/techs/file-provider'), { target: '?.bemjson.js' } ],
            require('enb/techs/bemdecl-from-bemjson'),
            [ require('enb/techs/levels'), { levels: getLevels(config) } ],
            require('enb/techs/deps-old'),
            require("enb/techs/files"),
            // require('enb-modules/techs/deps-with-modules'),
            [ require('enb/techs/browser-js'), {target:'?.pre.js'}],
            [ require('enb-modules/techs/prepend-modules'), {source: '?.pre.js'}],
            require('./techs/css-stylus-with-nib-axis'),
            // require('enb/techs/js'),
            // require('enb/techs/css'),
            // require('enb/techs/css-ie'),
            // require('enb/techs/css-ie6'),
            // require('enb/techs/css-ie7'),
            // require('enb/techs/css-ie8'),
            // require('enb/techs/css-ie9'),
            require('enb-bemxjst/techs/bemhtml'),
            //require('enb-bemxjst/techs/bemtree'),
            require('enb/techs/html-from-bemjson'),
        ]);

        nodeConfig.addTargets([
            '?.html',
            '_?.js',
            '_?.css'
        ]);

        function getLevels(config) {
          return [
            {path: '.bem/lib/bem-core/common.blocks', check: false},
            //{path: '.bem/lib/bem-core/desktop.blocks', check: false},
            //{path: '.bem/lib/bemhtml/common.blocks', check: false},
            //'common.blocks',
            //'desktop.blocks'
          ].map(function(levelPath) { return config.resolvePath(levelPath); });
        }

    });

    config.mode('development', function() {
        config.nodeMask(/desktop\.bundles\/.*/, function(nodeConfig) {
            nodeConfig.addTechs([
                [ require('enb/techs/file-copy'), { sourceTarget: '?.js', destTarget: '_?.js' } ],
                [ require('enb/techs/file-copy'), { sourceTarget: '?.css', destTarget: '_?.css' } ],
                [ require('enb/techs/file-copy'), { sourceTarget: '?.ie.css', destTarget: '_?.ie.css' } ],
                [ require('enb/techs/file-copy'), { sourceTarget: '?.ie6.css', destTarget: '_?.ie6.css' } ],
                [ require('enb/techs/file-copy'), { sourceTarget: '?.ie7.css', destTarget: '_?.ie7.css' } ],
                [ require('enb/techs/file-copy'), { sourceTarget: '?.ie8.css', destTarget: '_?.ie8.css' } ],
                [ require('enb/techs/file-copy'), { sourceTarget: '?.ie9.css', destTarget: '_?.ie9.css' } ],
            ]);
        });
    });

    config.mode('production', function() {
        config.nodeMask(/desktop\.bundles\/.*/, function(nodeConfig) {
            nodeConfig.addTechs([
                [ require('enb/techs/borschik'), { freeze: true, minify: true, sourceTarget: '?.js', destTarget: '_?.js' } ],
                [ require('enb/techs/borschik'), { freeze: true, minify: true, sourceTarget: '?.css', destTarget: '_?.css' } ],
                [ require('enb/techs/borschik'), { freeze: true, minify: true, sourceTarget: '?.ie.css', destTarget: '_?.ie.css' } ],
                [ require('enb/techs/borschik'), { freeze: true, minify: true, sourceTarget: '?.ie6.css', destTarget: '_?.ie6.css' } ],
                [ require('enb/techs/borschik'), { freeze: true, minify: true, sourceTarget: '?.ie7.css', destTarget: '_?.ie7.css' } ],
                [ require('enb/techs/borschik'), { freeze: true, minify: true, sourceTarget: '?.ie8.css', destTarget: '_?.ie8.css' } ],
                [ require('enb/techs/borschik'), { freeze: true, minify: true, sourceTarget: '?.ie9.css', destTarget: '_?.ie9.css' } ],
                [ require('enb/techs/borschik'), { freeze: true, minify: true, sourceTarget: '?.html', destTarget: '_?.html' } ],
            ]);
            nodeConfig.addTargets([
                '_?.html',
            ]);
        });
    });

    config.includeConfig('enb-checkout');

    config.module('enb-checkout', function(config) {
        config.addLibraries({
            '.bem/lib/bem-core' : {
                type: 'git',
                url: 'git://github.com/bem/bem-core.git',
                treeish: 'v1'
            },
            '.bem/lib/bem-components-v1' : {
                type: 'git',
                url: 'git://github.com/bem/bem-components.git',
                treeish: 'v1'
            },
            // '.bem/lib/bem-components-v2' : {
            //     type: 'git',
            //     url: 'git://github.com/bem/bem-components.git',
            //     treeish: 'v2'
            // },
            // '.bem/lib/bem-json' : {
            //     type: 'git',
            //     url: 'git://github.com/delfrrr/bem-json.git'
            // },
            // '.bem/lib/bemhtml' : {
            //     type: 'git',
            //     url: 'git://github.com/bem/bemhtml.git'
            // },
        });

    });

    config.task("libraries.get", function(task) {
        return config.module('enb-checkout').checkoutLibraries(task);
    });
};

