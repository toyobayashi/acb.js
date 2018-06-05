#!/usr/bin/env node

const util = require('util')
const program = require('commander')
const columnify = require('columnify')

const Acb = require('.')
let output = true

program
  .version('1.1.4', '-v, --version')
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

if (program.list) {
  output = false
  console.log(columnify(acb.getFileList(), {
    minWidth: 25,
    config: {
      ID: { minWidth: 5, maxWidth: 5 },
      Size: { minWidth: 10, maxWidth: 10 }
    }
  }))
}

if (program.header) {
  output = false
  console.log(acb.getHeaderTable())
}

if (program.cue) {
  output = false
  console.log(columnify(acb.getCueTable()))
}

if (program.cueName) {
  output = false
  console.log(columnify(acb.getCueNameTable(), {
    minWidth: 25,
    config: {
      CueIndex: { minWidth: 5 },
    }
  }))
}

if (program.waveform) {
  output = false
  console.log(columnify(acb.getWaveformTable(), {
    minWidth: 4,
  }))
}

if (program.synth) {
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
  acb.extract(program.outputDir === true ? void 0 : program.outputDir)
    .then(() => console.log('Extract done.'))
    .catch(err => console.log(err))
} else {
  if (program.outputDir) {
    acb.extract(program.outputDir === true ? void 0 : program.outputDir)
      .then(() => console.log('Extract done.'))
      .catch(err => console.log(err))
  }
}
