const fs = require('fs-extra')
const path = require('path')
const UTFTable = require('./src/UTFTable.js')
const TrackList = require('./src/TrackList.js')
const AFSArchive = require('./src/AFSArchive.js')

class Acb {
  constructor (acbFile) {
    this.path = acbFile
    this.headerTable = new UTFTable(fs.readFileSync(this.path))
    this.trackList = new TrackList(this.headerTable)
    this.awbFile = new AFSArchive(this.headerTable.rows[0].AwbFile)
  }

  extractSync (targetDir = path.join(path.dirname(this.path), `_acb_${path.basename(this.path)}`)) {
    fs.mkdirsSync(targetDir)
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
    
    let promise = fs.mkdirs(targetDir).then(() => {
      let task = []
      for (let track of this.trackList.tracks) {
        if (track.wavId in this.awbFile.files) task.push(fs.writeFile(path.join(targetDir, `${track.cueName}${Acb.encodeType[track.encodeType]}`), this.awbFile.files[track.wavId]))
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
          ID: track.wavId,
          Name: track.cueName + Acb.encodeType[track.encodeType],
          Size: this.awbFile.files[track.wavId].length
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

module.exports = Acb
