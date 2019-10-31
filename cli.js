#!/usr/bin/env node

const Emojideas = require('./index');

const commander = require('commander');
commander.option('-f, --fuzzy <fuzziness>', 'query fuzziness');
commander.parse(process.argv);

const emojideas = new Emojideas({ fuzzy: commander.fuzzy });

console.log(emojideas.suggest(commander.args.join(' ')));
