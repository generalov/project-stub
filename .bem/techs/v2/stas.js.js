/*jshint node:true */
"use strict";

var FS = require("fs"),
    Template = require("bem/lib/template");

// exports.API_VER = 2;

exports.techMixin = {

    getBuildResultChunk: function(relPath, absPath, suffix) {

        return [
            "/* " + relPath + ": begin */ /**/",
            FS.readFileSync(absPath) + ";",
            "/* " + relPath + ": end */ /**/",
            "\n"].join("\n");

    },

    getBuildResult: function (decl, levels, output, opts) {
    // getBuildResult: function(files, suffix, output, opts) {

        return this.__base.apply(this, arguments)
            .then(function (res) {
                res.unshift("var blocks = module.exports;\n");
                return res;
            });

    },

    getCreateResult: function (path, suffix, vars) {

        return Template.process([
            "(function () {",
            "    /*global blocks*/",
            "    'use strict';",
            "",
            "    blocks['{{bemBlockName}}'] = function () {",
            "        var bemjson = {",
            "            block: '{{bemBlockName}}'",
            "        };",
            "",
            "        return bemjson;",
            "    };",
            "",
            "}());"
        ], vars);

    }

};
