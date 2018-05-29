#!/usr/bin/env node

const extractACB = require('.')
const argv = process.argv.slice(2)
if (argv.length < 1) {
  console.log('\n  Usage:\n')
  console.log('    acb path/to/somefile.acb [outputdir]\n')
} else {
  extractACB(...argv)
}
