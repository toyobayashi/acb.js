const Reader = require('./Reader.js')

class UTFTable {
  constructor(acb) {
    if (acb.readUInt32BE() !== 0x40555446) throw new Error('not acb file')
    this.length = acb.readUInt32BE(4)
    this.r = new Reader(acb.slice(8))
    if (this.length !== this.r.length) throw new Error('error length')

    this.header = this.readHeader()
    this.name = this.readString(this.header.tableNameStringOffset)
    this.columns = this.readColumns()
    this.rows = this.readRows()
  }

  readHeader () {
    let back = this.r.tell()
    this.r.seek(0)
    let h = {}
    h.u1 = this.r.readUInt16BE()
    h.tableDataOffset = this.r.readUInt16BE()
    h.stringDataOffset = this.r.readUInt32BE()
    h.binaryDataOffset = this.r.readUInt32BE()
    h.tableNameStringOffset = this.r.readUInt32BE()
    h.columnLength = this.r.readUInt16BE()
    h.rowTotalByte = this.r.readUInt16BE()
    h.rowLength = this.r.readUInt32BE()

    this.r.seek(back)
    return h
  }

  readString (offset) {
    let back = this.r.tell()
    this.r.seek(this.header.stringDataOffset, offset)
    let arr = []
    while (true) {
      let b = this.r.readUInt8()
      if (b !== 0) arr.push(b)
      else break
    }
    this.r.seek(back)
    return Buffer.from(arr).toString()
  }

  readData (offset, type) {
    let back = this.r.tell()
    this.r.seek(this.header.tableDataOffset, offset)
    let data
    if (UTFTable.dataType[type] === 'String') {
      let stringOffset = this.r.readUInt32BE()
      data = this.readString(stringOffset)
    } else if (UTFTable.dataType[type] === 'Binary') {
      let binaryOffset = this.r.readUInt32BE()
      let length = this.r.readUInt32BE()
      data = this.readBinary(binaryOffset, length)
    } else {
      data = this.r['read' + UTFTable.dataType[type] + (type > 1 ? 'BE' : '')]()
    }
    this.r.seek(back)
    return data
  }

  readBinary (offset, length) {
    let back = this.r.tell()
    this.r.seek(this.header.binaryDataOffset, offset)
    let data = this.r.read(length)
    this.r.seek(back)
    return data
  }

  readColumns () {
    let back = this.r.tell()
    this.r.seek(24)
    let columns = []
    for (var i = 0; i < this.header.columnLength; i++) {
      let columnTypeAndDataType = this.r.readUInt8()
      let nameOffset = this.r.readUInt32BE()
      let columnType = columnTypeAndDataType & 0xf0
      let dataType = columnTypeAndDataType & 0x0f

      let columnName = this.readString(nameOffset)

      if (columnType === UTFTable.columnType.CONSTANT || columnType === UTFTable.columnType.CONSTANT2) {
        let data
        if (UTFTable.dataType[dataType] === 'String') {
          data = this.readString(this.r.readUInt32BE())
        } else if (UTFTable.dataType[dataType] === 'Binary') {
          let offset = this.r.readUInt32BE()
          let length = this.r.readUInt32BE()
          data = this.readBinary(offset, length)
        } else {
          data = this.r['read' + UTFTable.dataType[dataType] + (dataType > 1 ? 'BE' : '')]()
        }
        columns.push([columnName, UTFTable.dataType[dataType], data])
      } else {
        columns.push([columnName, UTFTable.dataType[dataType]])
      }
    }
    this.r.seek(back)
    return columns
  }

  readRows () {
    let rows = []
    let dataPos = 0
    let columns = this.columns

    for (var r = 0; r < this.header.rowLength; r++) {
      let dataPos = r * this.header.rowTotalByte
      let dynamic = {}
      let constants = {}

      for (var i = 0; i < this.header.columnLength; i++) {
        let [columnName, dataTypeString, constantData] = columns[i]

        if (constantData !== void 0) {
          constants[columnName] = constantData
        } else {
          let dataType = UTFTable.dataType.indexOf(dataTypeString)
          dynamic[columnName] = this.readData(dataPos, dataType)
          dataPos += UTFTable.dataLength[dataType]
        }

      }
      rows.push(Object.assign(dynamic, constants))
    }
    return rows
  }
}

UTFTable.columnType = {
  ZERO: 0x10,
  CONSTANT: 0x30,
  PERROW: 0x50,
  CONSTANT2: 0x70
}

UTFTable.dataType = [
  'UInt8', // 00
  'Int8', // 01
  'UInt16', // 02
  'Int16', // 03
  'UInt32', // 04
  'Int32', // 05
  'UInt64', // 06
  'Int64', // 07
  'Float', // 08
  'Double', // 09
  'String', // 0a
  'Binary' // 0b
]

UTFTable.dataLength = {
  [0x00]: 1,
  [0x01]: 1,
  [0x02]: 2,
  [0x03]: 2,
  [0x04]: 4,
  [0x05]: 4,
  [0x06]: 8,
  [0x07]: 8,
  [0x08]: 4,
  [0x09]: 8,
  [0x0a]: 4,
  [0x0b]: 8
}

module.exports = UTFTable
