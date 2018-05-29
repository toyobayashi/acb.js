module.exports = class Reader {
  constructor(buf) {
    this.buf = buf
    this.pos = 0
    this.length = buf.length
  }
  read (size = 1) {
    if (this.pos + size > this.length) throw new Error(`${this.pos} + ${size} > ${this.length} over length`)
    let b = Buffer.from(this.buf.slice(this.pos, this.pos + size))
    this.pos += size
    return b
  }
  tell () {
    return this.pos
  }
  seek (at, where = 0) {
    if (at + where > this.length) throw new Error(`${at} + ${where} > ${this.length} over length`)
    this.pos = at + where
  }
  readInt8 () {
    if (this.pos + 1 > this.length) throw new Error(`${this.pos} + 1 > ${this.length} over length`)
    let n = this.buf.readInt8(this.pos)
    this.pos++
    return n
  }
  readUInt8 () {
    if (this.pos + 1 > this.length) throw new Error(`${this.pos} + 1 > ${this.length} over length`)
    let n = this.buf.readUInt8(this.pos)
    this.pos++
    return n
  }
  readInt16BE () {
    if (this.pos + 2 > this.length) throw new Error(`${this.pos} + 2 > ${this.length} over length`)
    let n = this.buf.readInt16BE(this.pos)
    this.pos += 2
    return n
  }
  readUInt16BE () {
    if (this.pos + 2 > this.length) throw new Error(`${this.pos} + 2 > ${this.length} over length`)
    let n = this.buf.readUInt16BE(this.pos)
    this.pos += 2
    return n
  }
  readInt16LE () {
    if (this.pos + 2 > this.length) throw new Error(`${this.pos} + 2 > ${this.length} over length`)
    let n = this.buf.readInt16LE(this.pos)
    this.pos += 2
    return n
  }
  readUInt16LE () {
    if (this.pos + 2 > this.length) throw new Error(`${this.pos} + 2 > ${this.length} over length`)
    let n = this.buf.readUInt16LE(this.pos)
    this.pos += 2
    return n
  }

  readInt32BE () {
    if (this.pos + 4 > this.length) throw new Error(`${this.pos} + 4 > ${this.length} over length`)
    let n = this.buf.readInt32BE(this.pos)
    this.pos += 4
    return n
  }
  readUInt32BE () {
    if (this.pos + 4 > this.length) throw new Error(`${this.pos} + 4 > ${this.length} over length`)
    let n = this.buf.readUInt32BE(this.pos)
    this.pos += 4
    return n
  }
  readInt32LE () {
    if (this.pos + 4 > this.length) throw new Error(`${this.pos} + 4 > ${this.length} over length`)
    let n = this.buf.readInt32LE(this.pos)
    this.pos += 4
    return n
  }
  readUInt32LE () {
    if (this.pos + 4 > this.length) throw new Error(`${this.pos} + 4 > ${this.length} over length`)
    let n = this.buf.readUInt32LE(this.pos)
    this.pos += 4
    return n
  }

  readInt64BE () {
    if (this.pos + 8 > this.length) throw new Error(`${this.pos} + 8 > ${this.length} over length`)
    let b = parseInt(this.buf.slice(this.pos, this.pos + 8).toString('hex'), 16).toString(2)
    let f = b[0] === '0' ? 1 : -1
    let n = f * parseInt(b.substr(1), 2)
    this.pos += 8
    return n
  }
  readUInt64BE () {
    if (this.pos + 8 > this.length) throw new Error(`${this.pos} + 8 > ${this.length} over length`)
    let n = parseInt(this.buf.slice(this.pos, this.pos + 8).toString('hex'), 16)
    this.pos += 8
    return n
  }
  readInt64LE () {
    if (this.pos + 8 > this.length) throw new Error(`${this.pos} + 8 > ${this.length} over length`)
    let b = this.buf.slice(this.pos, this.pos + 8)
    let na = []
    for (let i = 7; i >= 0; i--) {
      na.push(b[i])
    }
    let b = parseInt(Buffer.from(na).toString('hex'), 16).toString(2)
    let f = b[0] === '0' ? 1 : -1
    let n = f * parseInt(b.substr(1), 2)
    this.pos += 8
    return n
  }
  readUInt64LE () {
    if (this.pos + 8 > this.length) throw new Error(`${this.pos} + 8 > ${this.length} over length`)
    let b = this.buf.slice(this.pos, this.pos + 8)
    let na = []
    for (let i = 7; i >= 0; i--) {
      na.push(b[i])
    }
    let n = parseInt(Buffer.from(na).toString('hex'), 16)
    this.pos += 8
    return n
  }
  readDoubleBE () {
    if (this.pos + 8 > this.length) throw new Error(`${this.pos} + 8 > ${this.length} over length`)
    let n = this.buf.readDoubleBE(this.pos)
    this.pos += 8
    return n
  }
  readDoubleLE () {
    if (this.pos + 8 > this.length) throw new Error(`${this.pos} + 8 > ${this.length} over length`)
    let n = this.buf.readDoubleLE(this.pos)
    this.pos += 8
    return n
  }
  readFloatBE () {
    if (this.pos + 4 > this.length) throw new Error(`${this.pos} + 4 > ${this.length} over length`)
    let n = this.buf.readFloatBE(this.pos)
    this.pos += 4
    return n
  }
  readFloatLE () {
    if (this.pos + 4 > this.length) throw new Error(`${this.pos} + 4 > ${this.length} over length`)
    let n = this.buf.readFloatLE(this.pos)
    this.pos += 4
    return n
  }
  readUIntBE (byteLength) {
    if (this.pos + byteLength > this.length) throw new Error(`${this.pos} + ${byteLength} > ${this.length} over length`)
    let n = this.buf.readUIntBE(this.pos, byteLength)
    this.pos += byteLength
    return n
  }
  readUIntLE (byteLength) {
    if (this.pos + byteLength > this.length) throw new Error(`${this.pos} + ${byteLength} > ${this.length} over length`)
    let n = this.buf.readUIntLE(this.pos, byteLength)
    this.pos += byteLength
    return n
  }
}
