/*global blocks */
(function() {
    'use strict';

    blocks['b-page'] = function() {
        var bundle = this.bundle,
            useProduction = (process.env.YENV === 'production'),
            baseUrl = 'http://CHANGEME/';

        return [
            { block: 'b-page',
                'title': 'Title of the page',
                'favicon': '../../favicon.ico',
                'head': [
                    { elem: 'meta', attrs: { 'name': 'description',
                        'content': ''
                    } },
                    { elem: 'meta', attrs: { 'name': 'keywords',
                        'content': ''
                    } },
                    { elem: 'meta', attrs: { 'property': 'og:title',
                        'content': ''
                    } },
                    { elem: 'meta', attrs: { 'property': 'og:description',
                        'content': ''
                    } },
                    { elem: 'meta', attrs: { 'property': 'og:type',
                        'content': 'website'
                    } },
                    { elem: 'meta', attrs: { 'property': 'og:url',
                        'content': baseUrl
                    } },
                    // { elem: 'meta', attrs: { 'property': 'og:image',
                    //     'content': baseUrl + '/image202x200.png'
                    // } },
                    // { elem: 'meta', attrs: { 'property': 'og:image:width',
                    //     'content': '200'
                    // } },
                    // { elem: 'meta', attrs: { 'property': 'og:image:height',
                    //     'content': '200'
                    // } },
                    { elem: 'css', 'ie': false,
                        // 'url': (useProduction ? '_' : '') + bundle + '.css',
                        'url': '_' + bundle + '.css'
                    },
                    { elem: 'css', 'ie': true,
                        'url': '_' + bundle + ''
                    }
                ],
                content: [
                    "Hello, I'm stas.js",

                    { block: 'i-jquery', mods: { 'version': '1.8.3' } },
                    { elem: 'js', 'url': '_' + bundle + '.js' }
                ]
            }
        ];
    };

}());
