module.exports = function(config) {

    config.nodes('desktop.bundles/*');

    config.nodeMask(/desktop\.bundles\/.*/, function(nodeConfig) {
        nodeConfig.addTechs([
            [ require('enb/techs/file-provider'), { target: '?.bemjson.js' } ],
            require('enb/techs/bemdecl-from-bemjson'),
            [ require('enb/techs/levels'), { levels: getLevels(config) } ],
            require('enb/techs/deps-old'),
            require("enb/techs/files"),
            [ require('enb/techs/browser-js'), {target:'?.pre.js'}],
            [ require('enb-modules/techs/prepend-modules'), {source: '?.pre.js'}],
            require("enb/techs/css-includes"),
            require('enb-bemxjst/techs/bemhtml'),
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
            'common.blocks',
          ].map(function(levelPath) { return config.resolvePath(levelPath); });
        }

    });

    config.mode('development', function() {
        config.nodeMask(/desktop\.bundles\/.*/, function(nodeConfig) {
            nodeConfig.addTechs([
                [ require('enb/techs/file-copy'), { sourceTarget: '?.js', destTarget: '_?.js' } ],
                [ require('enb/techs/file-copy'), { sourceTarget: '?.css', destTarget: '_?.css' } ],
            ]);
        });
    });

    config.mode('production', function() {
        config.nodeMask(/desktop\.bundles\/.*/, function(nodeConfig) {
            nodeConfig.addTechs([
                [ require('enb/techs/borschik'), { freeze: true, minify: true, sourceTarget: '?.js', destTarget: '_?.js' } ],
                [ require('enb/techs/borschik'), { freeze: true, minify: true, sourceTarget: '?.css', destTarget: '_?.css' } ],
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
            // 'libs/bem-components-v1' : {
            //     type: 'git',
            //     url: 'git://github.com/bem/bem-components.git',
            //     treeish: 'v1'
            // },
        });

    });

    config.task("libraries.get", function(task) {
        return config.module('enb-checkout').checkoutLibraries(task);
    });
};

