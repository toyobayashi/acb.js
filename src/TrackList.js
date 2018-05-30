const UTFTable = require('./UTFTable.js')

module.exports = class TrackList {
  constructor(utf) {
    let cues = this.cueTable = new UTFTable(utf.rows[0].CueTable)
    let nams = this.cueNameTable = new UTFTable(utf.rows[0].CueNameTable)
    let wavs = this.waveformTable = new UTFTable(utf.rows[0].WaveformTable)
    let syns = this.synthTable = new UTFTable(utf.rows[0].SynthTable)

    this.tracks = []

    let nameMap = {}

    for (let row of nams.rows) {
      nameMap[row.CueIndex] = row.CueName
    }

    for (let ind in cues.rows) {
      let row = cues.rows[ind]
      if (row.ReferenceType !== 3 && row.ReferenceType !== 8) throw new Error(`ReferenceType ${row.ReferenceType} not implemented.`)

      let referenceItems = syns.rows[row.ReferenceIndex].ReferenceItems
      let [a, b] = [referenceItems.readUInt16BE(0), referenceItems.readUInt16BE(2)]

      let wavId = wavs.rows[b] && wavs.rows[b].Id
      if (wavId === void 0) wavId = wavs.rows[b].MemoryAwbId

      let encodeType = wavs.rows[b].EncodeType
      let streaming = wavs.rows[b].Streaming

      this.tracks.push({
        cueId: row.CueId,
        cueName: nameMap[ind] || 'UNKNOWN',
        wavId,
        encodeType,
        streaming
      })
    }
  }
}
