module.exports = function(config) {
    config.node('desktop.bundles/index');

    config.loadModule = function(name) {
        var path = this.getRootPath() + '/node_modules/' + name;
        this.includeConfig(path);
        return this;
    };
    config.loadModule('enb-checkout');

    config.module('enb-checkout', function(config) {
        config.addLibraries({
            '.bem/lib/bem-core' : {
                type: 'git',
                url: 'git://github.com/bem/bem-core.git',
                treeish: 'v1'
            },
            // '.bem/lib/bem-json' : {
            //     type: 'git',
            //     url: 'git://github.com/delfrrr/bem-json.git'
            // },
            // '.bem/lib/bemhtml' : {
            //     type: 'git',
            //     url: 'git://github.com/bem/bemhtml.git'
            // },
            '.bem/lib/bem-components-v1' : {
                type: 'git',
                url: 'git://github.com/bem/bem-components.git',
                treeish: 'v1'
            },
            // '.bem/lib/bem-components-v2' : {
            //     type: 'git',
            //     url: 'git://github.com/bem/bem-components.git',
            //     treeish: 'v2'
            // }
        })
    });

    config.nodeMask(/desktop\.bundles\/.*/, function(nodeConfig) {
        nodeConfig.addTechs([
            new (require('enb/techs/file-provider'))({ target: '?.bemjson.js' }),
            new (require('enb/techs/bemdecl-from-bemjson'))(),
            new (require('enb/techs/levels'))({ levels: getLevels(config) }),
            new (require('enb-modules/techs/deps-with-modules'))(),
            // new (require('enb/techs/deps-old'))(),
            new (require('enb/techs/browser-js'))({target:'?.pre.js'}),
            new (require('enb-modules/techs/prepend-modules'))({source: '?.pre.js'}),
            new (require('enb/techs/files'))(),
            new (require('./techs/css-stylus-with-nib-axis'))(),
            // new (require('enb/techs/js'))(),
            // new (require('enb/techs/css'))(),
            // new (require('enb/techs/css-ie'))(),
            // new (require('enb/techs/css-ie6'))(),
            // new (require('enb/techs/css-ie7'))(),
            // new (require('enb/techs/css-ie8'))(),
            // new (require('enb/techs/css-ie9'))(),
            new (require('enb-bemxjst/techs/bemhtml'))(),
            //new (require('enb-bemxjst/techs/bemtree'))(),
            new (require('enb/techs/html-from-bemjson'))()
        ]);
        nodeConfig.addTargets([
            '?.html', '_?.js', '_?.css'
        ]);
    });

    config.mode('development', function() {
        config.nodeMask(/desktop\.bundles\/.*/, function(nodeConfig) {
            nodeConfig.addTechs([
                new (require('enb/techs/file-copy'))({ sourceTarget: '?.js', destTarget: '_?.js' }),
                new (require('enb/techs/file-copy'))({ sourceTarget: '?.css', destTarget: '_?.css' }),
                new (require('enb/techs/file-copy'))({ sourceTarget: '?.ie.css', destTarget: '_?.ie.css' }),
                new (require('enb/techs/file-copy'))({ sourceTarget: '?.ie6.css', destTarget: '_?.ie6.css' }),
                new (require('enb/techs/file-copy'))({ sourceTarget: '?.ie7.css', destTarget: '_?.ie7.css' }),
                new (require('enb/techs/file-copy'))({ sourceTarget: '?.ie8.css', destTarget: '_?.ie8.css' }),
                new (require('enb/techs/file-copy'))({ sourceTarget: '?.ie9.css', destTarget: '_?.ie9.css' })
            ]);
        });
    });
    config.mode('production', function() {
        config.nodeMask(/desktop\.bundles\/.*/, function(nodeConfig) {
            nodeConfig.addTechs([
                new (require('enb/techs/borschik'))({ sourceTarget: '?.js', destTarget: '_?.js' }),
                new (require('enb/techs/borschik'))({ sourceTarget: '?.css', destTarget: '_?.css' }),
                new (require('enb/techs/borschik'))({ sourceTarget: '?.ie.css', destTarget: '_?.ie.css' }),
                new (require('enb/techs/borschik'))({ sourceTarget: '?.ie6.css', destTarget: '_?.ie6.css' }),
                new (require('enb/techs/borschik'))({ sourceTarget: '?.ie7.css', destTarget: '_?.ie7.css' }),
                new (require('enb/techs/borschik'))({ sourceTarget: '?.ie8.css', destTarget: '_?.ie8.css' }),
                new (require('enb/techs/borschik'))({ sourceTarget: '?.ie9.css', destTarget: '_?.ie9.css' })
            ]);
        });
    });

    config.task("libraries.get", function(task) {
        return config.module('enb-checkout').checkoutLibraries(task);
    });
};

function getLevels(config) {
  return [
    {path: '.bem/lib/bem-core/common.blocks', check: false},
    //{path: '.bem/lib/bem-core/desktop.blocks', check: false},
    //{path: '.bem/lib/bemhtml/common.blocks', check: false},
    //'common.blocks',
    //'desktop.blocks'
  ].map(function(levelPath) { return config.resolvePath(levelPath); });
}
