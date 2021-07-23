#!/usr/bin/env node

const util = require('util')
const program = require('commander')
const columnify = require('columnify')

const Acb = require('.').Acb
let output = true

program
  .version(require('./package.json').version, '-v, --version')
  .usage('<somefile.acb> [options]')
  .option('-o, --outputDir [targetDir]', 'specify output directory')
  .option('-l, --list', 'list files')
  .option('-t, --header', 'show HeaderTable')
  .option('-c, --cue', 'show CueTable')
  .option('-n, --cue-name', 'show CueNameTable')
  .option('-w, --waveform', 'show WaveformTable')
  .option('-s, --synth', 'show SynthTable')
  .parse(process.argv)

if (program.args.length < 1) {
  program.help()
}

let acb = new Acb(program.args[0])

const opts = program.opts()

if (opts.list) {
  output = false
  const list = acb.getFileList()
  console.log(columnify(list.map(row => ({
    ID: row.id,
    Name: row.name,
    Size: row.buffer.length
  })), {
    minWidth: 25,
    config: {
      ID: { minWidth: 5, maxWidth: 5 },
      Size: { minWidth: 10, maxWidth: 10 }
    }
  }))
}

if (opts.header) {
  output = false
  console.log(acb.getHeaderTable())
}

if (opts.cue) {
  output = false
  console.log(columnify(acb.getCueTable()))
}

if (opts.cueName) {
  output = false
  console.log(columnify(acb.getCueNameTable(), {
    minWidth: 25,
    config: {
      CueIndex: { minWidth: 5 },
    }
  }))
}

if (opts.waveform) {
  output = false
  console.log(columnify(acb.getWaveformTable(), {
    minWidth: 4,
  }))
}

if (opts.synth) {
  output = false
  console.log(columnify(acb.getSynthTable(), {
    maxWidth: 10,
    config: {
      ReferenceItems: {
        minWidth: 25,
        maxWidth: 25,
        dataTransform (data) {
          return util.format(Buffer.from(data))
        }
      }
    }
  }))
}

if (output) {
  acb.extract(opts.outputDir === true ? void 0 : opts.outputDir)
    .then(() => console.log('Extract done.'))
    .catch(err => console.log(err))
} else {
  if (opts.outputDir) {
    acb.extract(opts.outputDir === true ? void 0 : opts.outputDir)
      .then(() => console.log('Extract done.'))
      .catch(err => console.log(err))
  }
}
