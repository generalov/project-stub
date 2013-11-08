/*global blocks,borschik*/
/*jslint strict:true*/

blocks['page'] = function() {
    var meta = {
        title: 'Page title',
        description: 'Sample page created by priv.js',
        keywords: 'priv.js,sample',
    };
    var nodeName = 'index';


    return {
        block: 'page',
        favicon: borschik.link('../../favicon.ico'),
        title: meta.title,
        head: [
            { elem: 'meta', attrs: { name: 'description', content: meta.description }},
            { elem: 'meta', attrs: { name: 'keywords', content: meta.keywords }},
            { elem: 'css', url: borschik.link('@_'+nodeName+'.css'), ie: false }
        ],
        content: [
            {
                block: 'header',
                content: [
                    'headerr content goes here'
                ]
            },
            {
                block: 'content',
                content: [
                    'main content'
                ]
            },
            {
                block: 'footer',
                content: [
                    'footer content goes here'
                ]
            },

            { block: 'i-jquery', elem: 'core' },
            { elem: 'js', url: borschik.link('@_'+nodeName+'.js') }
        ]
    };
};