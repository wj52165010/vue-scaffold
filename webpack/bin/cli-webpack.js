#!/usr/bin/env node
const { dev, pro, lib, sdk } = require('../dist')
const minimist = require('minimist')

const commands = {
  dev: dev,
  build: pro,
  lib: lib,
  sdk: sdk
}
const rawArgv = process.argv.slice(2)
const args = minimist(rawArgv)

commands[args._[0]]({
  FontFrame: args._[1]
})
