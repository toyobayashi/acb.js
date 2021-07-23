'use strict'
Object.defineProperty(exports, '__esModule', { value: true })

const fs = require('fs')
const path = require('path')
const UTFTable = require('./src/UTFTable.js')
const TrackList = require('./src/TrackList.js')
const AFSArchive = require('./src/AFSArchive.js')
const Reader = require('./src/Reader.js')

class Acb {
  constructor (acbFile) {
    this.path = acbFile
    this.headerTable = new UTFTable(fs.readFileSync(this.path))
    this.trackList = new TrackList(this.headerTable)
    if (!this.headerTable.rows[0].AwbFile || !this.headerTable.rows[0].AwbFile.length) {
      this.awbFile = new AFSArchive(fs.readFileSync(path.join(path.dirname(acbFile), path.basename(acbFile, '.acb') + '.awb')))
    } else {
      this.awbFile = new AFSArchive(this.headerTable.rows[0].AwbFile)
    }
  }

  extractSync (targetDir = path.join(path.dirname(this.path), `_acb_${path.basename(this.path)}`)) {
    fs.mkdirSync(targetDir, { recursive: true })
    for (let track of this.trackList.tracks) {
      if (track.wavId in this.awbFile.files) fs.writeFileSync(path.join(targetDir, `${track.cueName}${Acb.encodeType[track.encodeType]}`), this.awbFile.files[track.wavId])
      else throw new Error(`id ${track.wavId} not found in archive`)
    }
  }

  extract (targetDir, callback) {
    if (!targetDir) targetDir = path.join(path.dirname(this.path), `_acb_${path.basename(this.path)}`)
    if (typeof targetDir === 'function') {
      callback = targetDir
      targetDir = path.join(path.dirname(this.path), `_acb_${path.basename(this.path)}`)
    }
    
    let promise = fs.promises.mkdir(targetDir, { recursive: true }).then(() => {
      let task = []
      for (let track of this.trackList.tracks) {
        if (track.wavId in this.awbFile.files) task.push(fs.promises.writeFile(path.join(targetDir, `${track.cueName}${Acb.encodeType[track.encodeType]}`), this.awbFile.files[track.wavId]))
        else throw new Error(`id ${track.wavId} not found in archive`)
      }
      return Promise.all(task)
    })

    if (typeof callback !== 'function') return promise
    else promise.then(() => callback())
  }

  getHeaderTable () {
    return this.headerTable.rows
  }

  getCueTable () {
    return this.trackList.cueTable.rows
  }

  getCueNameTable () {
    return this.trackList.cueNameTable.rows
  }

  getWaveformTable () {
    return this.trackList.waveformTable.rows
  }

  getSynthTable () {
    return this.trackList.synthTable.rows
  }

  getFileList () {
    let list = []
    for (let track of this.trackList.tracks) {
      if (track.wavId in this.awbFile.files) {
        list.push({
          id: track.wavId,
          name: track.cueName + Acb.encodeType[track.encodeType],
          buffer: this.awbFile.files[track.wavId]
        })
      }
    }
    return list
  }
}

Acb.encodeType = {
  0: '.adx',
  2: '.hca',
  7: '.at3',
  8: '.vag',
  9: '.bcwav',
  13: '.dsp'
}

Acb.extractSync = function (acbFile, targetDir) {
  let acb = new Acb(acbFile)
  acb.extractSync(targetDir)
}

Acb.extract = function (acbFile, targetDir, callback) {
  if (typeof targetDir === 'function') {
    callback = targetDir
    targetDir = path.join(path.dirname(this.path), `_acb_${path.basename(this.path)}`)
  }
  let acb = new Acb(acbFile)
  return acb.extract(targetDir, callback)
}

exports.Acb = Acb
exports.Reader = Reader
exports.UTFTable = UTFTable
exports.TrackList = TrackList
exports.AFSArchive = AFSArchive
