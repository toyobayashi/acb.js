const Reader = require('./Reader.js')

module.exports = class AFSArchive {
  constructor(awb) {
    if (awb.readUInt32BE() !== 0x41465332) throw new Error('not awb file')

    this.r = new Reader(awb)
    this.length = this.r.length
    this.header = this.readHeader()
  }

  readHeader () {
    let back = this.r.tell()
    this.r.seek(4)
    let h = {}
    h.offsetSize = this.r.read(4)[1]
    h.fileCount = this.r.readUInt32LE()
    h.alignment = this.r.readUInt32LE()
    h.ids = []
    h.fileEndPoints = []
    for (let i = 0; i < h.fileCount; i++) {
      h.ids.push(this.r.readUInt16LE())
    }

    for (let i = 0; i < h.fileCount + 1; i++) {
      h.fileEndPoints.push(this.r.readUIntLE(h.offsetSize))
    }

    this.r.seek(back)
    return h
  }

  getFiles () {
    let back = this.r.tell()
    let files = {}
    for (let i = 0; i < this.header.ids.length; i++) {
      let id = this.header.ids[i]
      let start = Math.ceil(this.header.fileEndPoints[i] / this.header.alignment) * this.header.alignment
      let length = this.header.fileEndPoints[i + 1] - start
      this.r.seek(start)
      let buf = this.r.read(length)
      // let buf = this.r.buf.slice(start, this.header.fileEndPoints[i + 1])
      files[id] = buf
    }
    this.r.seek(back)
    return files
  }
}
