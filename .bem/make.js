/* jshint node:true */
/* global MAKE */

require('bem-environ/lib/nodes');

//process.env.YENV = 'production';
process.env.BEM_I18N_LANGS = ['ru'];
process.env.BORSCHIK_FREEZABLE_EXTS = 'jpg jpeg gif ico png swf svg ttf eot otf woff htc'; // append 'htc'

MAKE.decl('Arch', {

    blocksLevelsRegexp: /^.+?\.blocks/,
    bundlesLevelsRegexp: /^.+?\.bundles$/,

    libraries: [
        'bem-bl @ 0.3',
        'bem-controls @ v1'
    ]

});


MAKE.decl('BundleNode', {

    getTechs: function() {

        return [
            // 'bemjson.js',
            'bemdecl.js',
            'deps.js',

            'bemhtml',

            'css',
            'ie.css',

            'ie6.css',
            'ie7.css',
            'ie8.css',
            'ie9.css',

            'stas.js',

            // 'js',
            // 'stas.html',

            'i18n',
            'i18n.js',
            'i18n.stas.html'
        ];

    },

    'create-i18n.js-optimizer-node': function(tech, sourceNode, bundleNode) {

        return this['create-js-optimizer-node'].apply(this, arguments);

    },

    'create-stas.html-node': function(tech, bundleNode, magicNode) {

        return this['create-html-node'].apply(this, arguments);

    },

    'create-i18n.stas.html-node': function(tech, bundleNode, magicNode) {

        return this['create-html-node'].apply(this, arguments);

    }

});
