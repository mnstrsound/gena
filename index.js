#!/usr/bin/env node

'use strict';

const path = require('path');

const dir = require('node-dir');
const fse = require('fs-extra');

const clientRoot = process.cwd();
const clientConfig = require(path.join(clientRoot, 'gena.config.js'));

const argv = process.argv.slice(2)[0];
const args = argv.split(':');
const command = args[0];
const params = args[1].split(',');

const defaultConfig = {
    templatesPath: 'gena_templates'
};

const config = Object.assign({}, defaultConfig, clientConfig);

dir.paths(`./gena_templates/${command}`, function (error, paths) {
    let {files} = paths;

    files.forEach(file => {
        let templateFunc = require(path.join(clientRoot, file));
        let {fileName, template} = templateFunc.apply(null, params);
        let src = config.paths[command] ? config.paths[command] : command;
        let filePath = path.join(clientRoot, src, params[0], fileName);

        try {
            fse.outputFileSync(filePath, template);
        } catch (e) {
            console.log(e);
        }
        console.log(`File was created: ${filePath}`);
    });
    console.log(`Gena is awesome`);
});