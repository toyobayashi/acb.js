const fs = require('fs-extra')
const path = require('path')
const UTFTable = require('./src/UTFTable.js')
const TrackList = require('./src/TrackList.js')
const AFSArchive = require('./src/AFSArchive.js')

module.exports = function (acbFile, targetDir = path.join(path.dirname(acbFile), `_acb_${path.basename(acbFile)}`)) {
  if (!fs.existsSync(targetDir)) fs.mkdirsSync(targetDir)
  const wavType = {
    0: '.adx',
    2: '.hca',
    7: '.at3',
    8: '.vag',
    9: '.bcwav',
    13: '.dsp'
  }
  let utf = new UTFTable(fs.readFileSync(acbFile))
  let cue = new TrackList(utf)
  let awb = new AFSArchive(utf.rows[0].AwbFile)
  let files = awb.getFiles()
  for (let track of cue.tracks) {
    let name = `${track[1]}${wavType[track[3]]}`
    if (track[2] in files) fs.writeFileSync(path.join(targetDir, name), files[track[2]])
    else throw new Error(`id ${track[2]} not found in archive`)
  }
}
